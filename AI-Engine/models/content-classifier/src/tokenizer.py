from transformers import AutoTokenizer


def load_tokenizer(model_name: str = "distilbert-base-uncased"):
    return AutoTokenizer.from_pretrained(model_name)
