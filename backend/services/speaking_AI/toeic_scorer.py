from services.speaking_AI.groq_service import send_message

def score_toeic_sp_q1_2(reference_text: str, transcript: str) -> str:
    prompt = f"""
You are a TOEIC Speaking examiner.

TASK: TOEIC Speaking – Question 1–2 (Read a text aloud)

REFERENCE TEXT:
"{reference_text}"

CANDIDATE TRANSCRIPT:
"{transcript}"

Your job is to evaluate the candidate using TOEIC Speaking-style feedback.
Be supportive, fair, and constructive in comments.
However, the Accuracy score MUST be calculated in a strictly objective, word-by-word manner.

--------------------
ACCURACY SCORING RULES (STRICT – NO FLEXIBILITY):

1. Split both texts into words using whitespace as the delimiter.
2. Compare words sequentially by position.
3. A word is counted as correct ONLY IF it is exactly the same as the corresponding word
   in the reference text.
   - Case-sensitive
   - Punctuation-sensitive
   - No spelling correction
   - No synonym or semantic matching
4. Missing words, extra words, or incorrect words are counted as incorrect.
5. Accuracy formula:
   Accuracy (%) = (Number of correct words / Total number of words in the reference text) × 100
6. Do NOT infer meaning.
7. Do NOT be lenient for the Accuracy score.
8. After calculating the Accuracy score, round it to the nearest whole number.

--------------------
OTHER SCORES (HOLISTIC TOEIC-STYLE):

- Fluency score (0–100): Consider smoothness, pacing, pauses, and rhythm.
- Pronunciation score (0–100): Consider clarity, stress, intonation, and intelligibility.
  Minor or natural pronunciation errors are acceptable if understanding is not affected.

--------------------
OUTPUT FORMAT (FOLLOW EXACTLY):

Accuracy score (0–100): <number>

Fluency score (0–100): <number>

Pronunciation score (0–100): <number>

Overall comment:
- Brief, positive, and constructive summary of the performance.

Mistakes and suggestions for improvement:
- List key mistakes that affect understanding (if any).
- Give clear, practical, TOEIC-relevant suggestions for improvement.

"""


    return send_message(prompt)


def score_toeic_sp_q3_4(transcript: str, reference_description: str) -> str:
    prompt = f"""
You are a TOEIC Speaking examiner.

Task: Describe a picture (Question 3-4).

REFERENCE DESCRIPTION (correct picture content):
"{reference_description}"

STUDENT ANSWER:
"{transcript}"


Evaluate based on:
- Accuracy of content compared to the picture (don't need to describe every detail, but main points should be correct)
- Grammar
- Vocabulary
- Cohesion

Give:
1. Overall score (0-100)
2. Content accuracy score
3. Language score
4. Specific mistakes (content + language)
5. Improved TOEIC-style answer
"""
    return send_message(prompt)

def score_toeic_sp_q5_7(question: str, answer: str) -> str:
    prompt = f"""
You are a TOEIC Speaking examiner.

Context:
A British marketing firm is conducting a telephone interview about leisure activities.

Question:
\"\"\"{question}\"\"\"

Student answer:
\"\"\"{answer}\"\"\"

Evaluate according to ETS TOEIC Speaking criteria:

- Relevance of content
- Completeness of content
- Grammar
- Vocabulary
- Pronunciation (assume from transcript)
- Cohesion

Give:
1. Overall score (0–100)
2. Subscores for each criterion
3. Specific mistakes or weaknesses
4. A high-scoring sample answer (TOEIC level)

Be strict like ETS examiners.
"""
    return send_message(prompt)


def score_toeic_sp_q8_10(
    poster_text: str,
    question: str,
    transcript: str
) -> str:
    prompt = f"""
You are a TOEIC Speaking examiner.

Task: Respond to questions using provided information.

INFORMATION PROVIDED:
\"\"\"{poster_text}\"\"\"

QUESTIONS:
\"\"\"{question}\"\"\"
STUDENT ANSWER (spoken transcript):
\"\"\"{transcript}\"\"\"

Evaluate strictly based on ETS TOEIC criteria:
- Pronunciation (assume from transcript)
- Grammar
- Vocabulary
- Cohesion
- Relevance of content
- Completeness of content

Give:
1. Overall score (0–100)
2. Specific missing or incorrect information
3. Correct sample answers (TOEIC level)

"""
    return send_message(prompt)


def score_toeic_sp_q11(question: str, transcript: str) -> str:
    prompt = f"""
You are a TOEIC Speaking examiner.

Task: Express an opinion (Question 11).

QUESTION:
\"\"\"{question}\"\"\"

STUDENT ANSWER (spoken transcript):
\"\"\"{transcript}\"\"\"

Evaluate strictly based on ETS TOEIC Speaking criteria:
- Pronunciation (assume from transcript)
- Grammar
- Vocabulary
- Cohesion
- Development of ideas
- Support and examples

Give:
1. Overall score (0–100)
2. Detailed feedback for each criterion
3. Specific grammar or vocabulary mistakes
4. Suggestions to improve the response
5. A high-scoring sample answer (TOEIC level, 60 seconds)

"""
    return send_message(prompt)

def score_toeic_w_q1_5(
    image_description: str,
    required_words: list[str],
    student_sentence: str
):
    prompt = f"""
You are a TOEIC Writing examiner.

Task: Write ONE sentence based on a picture.

Picture description:
\"\"\"{image_description}\"\"\"

Required words/phrases (must be used):
{", ".join(required_words)}

Student sentence:
\"\"\"{student_sentence}\"\"\"

Evaluate strictly based on ETS TOEIC Writing criteria:

1. Grammar accuracy
2. Relevance to the picture
3. Correct use of required words
4. Sentence completeness

Give:
- Score (0–3)
- Explanation
- Corrected version (if needed)


"""
    return send_message(prompt)

def score_toeic_w_q6_7(
    email_prompt: str,
    student_email: str,
    directions: str
):
    prompt = f"""
You are a TOEIC Writing examiner.

Task: Write an email based on a prompt.

Email prompt:
\"\"\"{email_prompt}\"\"\"
Directions:
\"\"\"{directions}\"\"\"

Student email:
\"\"\"{student_email}\"\"\"

Evaluate student email based on ETS TOEIC Writing criteria:

1. Grammar accuracy
2. Relevance to the email prompt and directions
3. Email structure (greeting, body, closing)
4. Appropriate tone and register

Give:
- Score (0–3)
- Explanation
- Corrected version


"""
    return send_message(prompt)
    

def score_toeic_w_q8(
        question: str,
        student_response: str
):
    prompt = f"""
You are a TOEIC Writing examiner.
Task: Write a response to a question.
Question:
\"\"\"{question}\"\"\"
Student response:
\"\"\"{student_response}\"\"\"
Evaluate student response based on ETS TOEIC Writing criteria:
1. Grammar accuracy
2. Relevance to the question
3. Response completeness
Give:
- Score (0–3)
- Explanation
- Corrected version
"""
    return send_message(prompt)