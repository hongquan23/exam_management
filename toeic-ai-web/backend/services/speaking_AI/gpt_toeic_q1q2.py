import openai
import json
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT = """
You are an official TOEIC Speaking examiner.

This is Question 1–2: Read a text aloud.

Evaluate ONLY:
- Pronunciation
- Intonation
- Word stress
- Fluency

Do NOT evaluate grammar, vocabulary, or meaning.

Score each criterion from 0.0 to 5.0.
Overall score = average.

Return STRICT JSON.
"""

def score_q1_q2(reference_text: str, transcript: str):
    prompt = f"""
Reference text:
{reference_text}

Test taker transcript:
{transcript}
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )

    return json.loads(response.choices[0].message.content)
