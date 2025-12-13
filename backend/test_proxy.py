from fp.fp import FreeProxy
import sys

try:
    print("Fetching free proxy...")
    proxy = FreeProxy(country_id=['US', 'CA'], rand=True).get()
    print(f"Proxy found: {proxy}")
except Exception as e:
    print(f"Error fetching proxy: {e}")
    sys.exit(1)
