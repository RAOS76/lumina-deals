import math

def calculate_lumina_score(rating, review_count, discount_percentage, sentiment_score=0.5):
    """
    Calcula el 'Lumina Score' (0-100) basado en múltiples factores.
    
    Fórmula:
    - Calidad (Rating): 30%
    - Popularidad (Log Reviews): 20%
    - Oportunidad (Descuento): 30%
    - Sentimiento IA: 20%
    """
    
    # 1. Normalizar Rating (0-5 -> 0-100)
    # Un rating de 3.5 es mediocre, 4.5 es bueno.
    # Penalizamos fuertemente < 4.0
    if rating < 4.0:
        rating_score = (rating / 4.0) * 60 # Max 60 si es bajo
    else:
        rating_score = 60 + ((rating - 4.0) * 40) # 4.0->60, 5.0->100
        
    # 2. Normalizar Reviews (Logarítmico)
    # 10 reviews = poco fiable. 1000 reviews = muy fiable.
    # log10(1000) = 3. log10(100000) = 5.
    # Cap en 10,000 reviews para el score máximo.
    if review_count == 0:
        review_score = 0
    else:
        log_reviews = math.log10(review_count)
        review_score = min(100, (log_reviews / 4.0) * 100) # 10,000 reviews = 100 pts
        
    # 3. Score de Descuento
    # 0% -> 0 pts. 50% -> 100 pts.
    discount_score = min(100, discount_percentage * 2)
    
    # 4. Score de Sentimiento (0.0 - 1.0 -> 0-100)
    sentiment_points = sentiment_score * 100
    
    # Ponderación Final
    final_score = (
        (rating_score * 0.30) +
        (review_score * 0.20) +
        (discount_score * 0.30) +
        (sentiment_points * 0.20)
    )
    
    return int(final_score)
