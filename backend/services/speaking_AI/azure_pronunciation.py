import azure.cognitiveservices.speech as speechsdk


def score_read_aloud(wav_path: str, reference_text: str):
    speech_config = speechsdk.SpeechConfig(
        subscription="YOUR_KEY",
        region="YOUR_REGION"
    )

    # 🔥 BẮT BUỘC
    pronunciation_config = speechsdk.PronunciationAssessmentConfig(
        reference_text=reference_text,
        grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
        granularity=speechsdk.PronunciationAssessmentGranularity.Phoneme,
        enable_miscue=True
    )

    audio_config = speechsdk.audio.AudioConfig(filename=wav_path)

    recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config,
        audio_config=audio_config
    )

    # 🔥 DÒNG QUYẾT ĐỊNH
    pronunciation_config.apply_to(recognizer)

    result = recognizer.recognize_once()

    if result.reason == speechsdk.ResultReason.Canceled:
        cancellation = speechsdk.CancellationDetails(result)
        raise RuntimeError(
            f"Canceled: {cancellation.reason}, "
            f"details: {cancellation.error_details}"
        )

    if result.reason != speechsdk.ResultReason.RecognizedSpeech:
        raise RuntimeError(f"Speech not recognized: {result.reason}")

    # 🔥 CÁCH LẤY KẾT QUẢ ĐÚNG (SDK >= 1.15)
    assessment = speechsdk.PronunciationAssessmentResult(result)
    return assessment
