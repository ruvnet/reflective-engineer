import unittest
from src.main import load_config

class TestMain(unittest.TestCase):
    def test_load_config(self):
        config = load_config('config/config.yaml')
        self.assertIsNotNone(config)
        self.assertIn('total_eth', config)

if __name__ == '__main__':
    unittest.main()
