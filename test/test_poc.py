

import requests

import unittest

import json

class TestPoc(unittest.TestCase):
    
    def setUp(self):
        
        pass
        
      
    def test_internal_server_error(self):
        
        url = 'http://127.0.0.1:6226/poc.test'
        
        payload = {"name":"mtp_find_cf1", "ver":"V1.1"}
        headers = {'content-type': 'application/json', 'accept':'json','User-Agent':'mabo'}
        #headers = {'Accept':'json'}
        #payload = json.dumps(payload)
        
        r = requests.post(url, data =   payload , headers={})
        #print  r.headers
        #v = r.text #json.loads(r.text)
        assert r.status_code == 500
        assert r.reason == 'Internal Server Error'
        assert r.text == 'error in poc'
        
        
    def test_not_found(self):
        
        url = 'http://127.0.0.1:6226/poc.notfound'
        
        payload = {"name":"mtp_find_cf1", "ver":"V1.1"}
        
        headers = {'content-type': 'application/json', 'accept':'json','User-Agent':'mabo'}
        #headers = {'Accept':'json'}
        payload = json.dumps(payload)
        
        r = requests.post(url, data =   payload , headers=headers)
        #v = r.text #json.loads(r.text)
        assert r.status_code == 404
        assert r.text == 'Not Found'
        assert r.reason == 'Not Found'
        
if __name__ == "__main__":
    
    unittest.main()