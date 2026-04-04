import json
import os
import numpy as np

# Lazy imports — loaded only when first needed
_index = None
_rules = None
_model = None


def _load():
    """Load rules, embed them, build FAISS index. Runs once."""
    global _index, _rules, _model

    if _index is not None:
        return  # already loaded

    from sentence_transformers import SentenceTransformer
    import faiss

    # Load rules
    rules_path = os.path.join(os.path.dirname(__file__), "traffic_rules.json")
    with open(rules_path, "r") as f:
        _rules = json.load(f)

    # Load embedding model (downloads ~90MB on first run)
    _model = SentenceTransformer("all-MiniLM-L6-v2")

    # Embed all rules
    texts = [r["rule"] for r in _rules]
    embeddings = _model.encode(texts, convert_to_numpy=True)
    embeddings = embeddings.astype(np.float32)

    # Build FAISS index
    dimension = embeddings.shape[1]
    _index = faiss.IndexFlatL2(dimension)
    _index.add(embeddings)

    print(f"✅ RAG: Loaded {len(_rules)} traffic rules into FAISS index")


def retrieve_rules(scenario_text: str, top_k: int = 3) -> list[str]:
    """Given a scenario description, return top_k most relevant rules."""
    _load()

    from sentence_transformers import SentenceTransformer
    import faiss

    query_embedding = _model.encode([scenario_text], convert_to_numpy=True)
    query_embedding = query_embedding.astype(np.float32)

    distances, indices = _index.search(query_embedding, top_k)

    retrieved = []
    for idx in indices[0]:
        if idx < len(_rules):
            retrieved.append(_rules[idx]["rule"])

    return retrieved