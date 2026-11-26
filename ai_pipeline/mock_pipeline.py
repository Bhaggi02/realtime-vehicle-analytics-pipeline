import time
import random
import psycopg2
from threading import Thread

# Auto table initialization engine
def init_db_table():
    try:
        conn = psycopg2.connect(
            host="localhost", 
            database="vehicle_analytics", 
            user="postgres", 
            password="vision_password", 
            port="5432"
        )
        cur = conn.cursor()
        # Table automatic build check configuration query
        cur.execute("""
            CREATE TABLE IF NOT EXISTS vehicle_events (
                id SERIAL PRIMARY KEY,
                vehicle_id INT NOT NULL,
                color VARCHAR(50) NOT NULL,
                direction VARCHAR(20) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Database Table verified and created successfully!")
    except Exception as e:
        print(f"❌ Initialization Error: {e}")

def log_to_db(vehicle_id, color, direction):
    try:
        conn = psycopg2.connect(
            host="localhost", 
            database="vehicle_analytics", 
            user="postgres", 
            password="vision_password", 
            port="5432"
        )
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO vehicle_events (vehicle_id, color, direction) VALUES (%s, %s, %s);",
            (vehicle_id, color, direction)
        )
        conn.commit()
        cur.close()
        conn.close()
        print(f"📊 Saved to DB: Vehicle #{vehicle_id} ({color}) going {direction}")
    except Exception as e:
        print(f"❌ Database Insertion Error: {e}")

# First run auto initializer table
init_db_table()

vehicle_counter = 100
print("🚀 Mock AI Tracking Pipeline started! Press Ctrl+C to stop.")

try:
    while True:
        time.sleep(random.uniform(2.0, 5.0))
        vehicle_counter += 1
        color = random.choice(["Red", "Blue", "Black", "White", "Silver", "Yellow"])
        direction = random.choice(["Inbound", "Outbound"])
        
        Thread(target=log_to_db, args=(vehicle_counter, color, direction)).start()
except KeyboardInterrupt:
    print("\n🛑 Pipeline stopped.")
