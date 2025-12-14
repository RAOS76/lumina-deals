import requests
import os

# Hardcoded for immediate testing based on user input
API_KEY = "re_KCURturJ_LcZhesfTbTyCgV4y2Kuv4ULm"
FROM_EMAIL = "Lumina <hola@luminaofertas.com>"
TO_EMAIL = "raos_76@hotmail.com"

def test_send():
    print(f"Testing sending from {FROM_EMAIL} to {TO_EMAIL}...")
    
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "from": FROM_EMAIL,
        "to": TO_EMAIL,
        "subject": "Verificación de Dominio Lumina",
        "html": "<p>Si recibes esto, el dominio está <strong>VERIFICADO</strong> y funcionando. 🚀</p>"
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print(">>> ÉXITO: El correo se envió correctamente.")
        else:
            print(">>> ERROR: Resend rechazó el envío. Revisa los registros DNS.")
            
    except Exception as e:
        print(f"Error de conexión: {e}")

if __name__ == "__main__":
    test_send()
