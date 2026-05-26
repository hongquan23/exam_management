import json
import re
from groq import Groq
from core.config import settings

# Use a larger, more accurate model for translation quality
_TRANSLATE_MODEL = "llama-3.3-70b-versatile"


def _infer_text_type(text: str) -> str:
    words = text.strip().split()
    if len(words) == 1:
        return "word"
    if len(words) <= 6:
        return "phrase"
    return "sentence"


def translate_text(text: str) -> dict:
    text_type = _infer_text_type(text)
    client = Groq(api_key=settings.GROQ_API_KEY)

    system = (
        "You are a professional English-Vietnamese dictionary and linguist. "
        "You MUST translate the EXACT word or phrase given — never confuse it with another word. "
        "Always respond with ONLY a valid JSON object, no markdown, no extra text."
    )

    if text_type == "word":
        prompt = f"""Translate this exact English word to Vietnamese: "{text}"

Rules:
- "translated_text": list ALL common Vietnamese meanings separated by " / " (e.g. "thời tiết / thời tiết xấu" for "weather")
- "word_type": the grammatical category (noun, verb, adjective, adverb, preposition, conjunction, pronoun, interjection)
- "ipa": the correct IPA phonetic transcription for THIS word (e.g. /ˈweðər/ for "weather", /ɡʊd/ for "good")
- "example": a natural English sentence using this word in context
- "example_translation": accurate Vietnamese translation of that example sentence
- "explanation": null for single common words

Example output for the word "weather":
{{
  "translated_text": "thời tiết",
  "word_type": "noun",
  "ipa": "/ˈweðər/",
  "example": "The weather today is sunny and warm.",
  "example_translation": "Thời tiết hôm nay nắng và ấm áp.",
  "explanation": null
}}

Now translate: "{text}"
Return ONLY the JSON object."""

    elif text_type == "phrase":
        prompt = f"""Translate this exact English phrase to Vietnamese: "{text}"

Rules:
- "translated_text": the most accurate Vietnamese meaning of this EXACT phrase
- "word_type": phrase / idiom / collocation / phrasal verb (pick the most fitting)
- "ipa": null (phrases don't need IPA)
- "example": an English sentence using this phrase naturally
- "example_translation": accurate Vietnamese translation of that sentence
- "explanation": explain the meaning and usage in Vietnamese (1-2 sentences)

Example output for "catch someone off guard":
{{
  "translated_text": "khiến ai đó bất ngờ, không kịp chuẩn bị",
  "word_type": "idiom",
  "ipa": null,
  "example": "The sudden question caught him completely off guard.",
  "example_translation": "Câu hỏi đột ngột khiến anh ấy hoàn toàn bất ngờ.",
  "explanation": "Thành ngữ này có nghĩa là làm ai đó bất ngờ khi họ chưa chuẩn bị hoặc không đề phòng."
}}

Now translate: "{text}"
Return ONLY the JSON object."""

    else:
        prompt = f"""Translate this exact English sentence/clause to Vietnamese: "{text}"

Rules:
- "translated_text": accurate, natural Vietnamese translation of the ENTIRE sentence
- "word_type": "sentence"
- "ipa": null
- "example": null
- "example_translation": null
- "explanation": briefly explain the meaning or context in Vietnamese if helpful, otherwise null

Return ONLY the JSON object:
{{
  "translated_text": "...",
  "word_type": "sentence",
  "ipa": null,
  "example": null,
  "example_translation": null,
  "explanation": "..."
}}

Now translate: "{text}"
Return ONLY the JSON object."""

    response = client.chat.completions.create(
        model=_TRANSLATE_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        max_tokens=500,
        temperature=0.1,  # very low — accuracy over creativity
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown code fences if model wraps output
    json_match = re.search(r"\{.*\}", raw, re.DOTALL)
    if json_match:
        raw = json_match.group(0)

    data = json.loads(raw)

    return {
        "original_text": text,
        "translated_text": data.get("translated_text", ""),
        "word_type": data.get("word_type"),
        "text_type": text_type,
        "ipa": data.get("ipa") or None,
        "example": data.get("example") or None,
        "example_translation": data.get("example_translation") or None,
        "explanation": data.get("explanation") or None,
    }
