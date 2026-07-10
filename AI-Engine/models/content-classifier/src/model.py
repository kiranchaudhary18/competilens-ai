from transformers import AutoModelForSequenceClassification


def build_model(model_name: str = "distilbert-base-uncased", num_labels: int = 8):
    return AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=num_labels)
