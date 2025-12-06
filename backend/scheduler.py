import time
import subprocess
import datetime
import sys

def run_scraper_job():
    print(f"\n[CRON] Ejecutando Scraper: {datetime.datetime.now()}")
    try:
        # Ejecutar main.py como subproceso
        result = subprocess.run([sys.executable, "main.py"], capture_output=True, text=True)
        print("--- Output del Scraper ---")
        print(result.stdout)
        if result.stderr:
            print("--- Errores ---")
            print(result.stderr)
        print("[CRON] Trabajo finalizado.")
    except Exception as e:
        print(f"[CRON] Error crítico lanzando scraper: {e}")

if __name__ == "__main__":
    INTERVAL_HOURS = 6
    INTERVAL_SECONDS = INTERVAL_HOURS * 3600
    
    print(f">>> Iniciando Sheduler Local de Lumina")
    print(f">>> Ejecutando cada {INTERVAL_HOURS} horas.")
    print(">>> (Mantén esta ventana abierta o minimizada)")
    
    # Ejecutar inmediatamente al inicio
    run_scraper_job()
    
    while True:
        print(f"[ESPERANDO] Próxima ejecución en {INTERVAL_HOURS} horas...")
        time.sleep(INTERVAL_SECONDS)
        run_scraper_job()
