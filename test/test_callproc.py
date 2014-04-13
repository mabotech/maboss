

import requests

import unittest

import json

class TestCallProc(unittest.TestCase):
    
    def setUp(self):
        
        pass
        
    def test_get(self):
        url = 'http://127.0.0.1:6226/'
        
        payload = {"name":"mtp_find_cf1"}
        
        headers = {'content-type': 'application/json', 'accept':'json','User-Agent':'mabo'}
        r = requests.get(url, headers = headers)
        
        #v = r.text #json.loads(r.text)
        try:
            v = r.json()
        
            print(url, v)        
        except:
            print url, r.status_code
            print r
            
    def test_work(self):
        
        url = 'http://127.0.0.1:6226/work'
        
        payload = {"name":"mtp_find_cf1", "ver":"V1.1"}
        
        headers = {'content-type': 'application/json', 'accept':'json','User-Agent':'mabo'}
        #headers = {'Accept':'json'}
        #payload = json.dumps(payload)
        
        r = requests.post(url, data =   payload , headers={})
        #v = r.text #json.loads(r.text)
        print url, r.status_code
        v = r.json()
        print "json:",r.json()
        print "text:",r.text
        print "reason:",r.reason
        
    def test_app_throw(self):
        
        url = 'http://127.0.0.1:6226/callproc'
        
        payload = {"name":"mtp_find_cf1", "ver":"V1.1"}
        headers = {'content-type': 'application/json', 'accept':'json','User-Agent':'mabo'}
        #headers = {'Accept':'json'}
        #payload = json.dumps(payload)
        
        r = requests.post(url, data =   payload , headers={})
        print  r.headers
        #v = r.text #json.loads(r.text)
        print url,  r.status_code
        
        #print r.json()
        
        try:
            v = r.json()
            
            print(v)
        except:
            print url,  r.status_code
            print 'reason:',r.reason
            print r.text
            print(dir(r))           
        
    def test_callproc(self):
        
        url = 'http://127.0.0.1:6226/test'
        
        payload = {"name":"mtp_find_cf1", "ver":"V1.1"}
        
        headers = {'content-type': 'application/json', 'accept':'json','User-Agent':'mabo'}
        #headers = {'Accept':'json'}
        payload = json.dumps(payload)
        
        r = requests.post(url, data =   payload , headers=headers)
        #v = r.text #json.loads(r.text)
        print url,  r.status_code
        
        try:
            v = r.json()
            
            print(v)
        except:
            print url,  r.status_code
            print r
            print r.status_code
            print r.text  #content
            print r.content
            #print(dir(r))   
        
if __name__ == "__main__":
    
    unittest.main()