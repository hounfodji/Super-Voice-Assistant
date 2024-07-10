import os


import environ




BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV = environ.Env()


env_path = os.path.join(BASE_DIR, ".env")
if os.path.exists(env_path):
   ENV.read_env(env_path)
