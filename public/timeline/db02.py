# -*- coding: utf-8 -*-

#import time

#from time import strftime, localtime

from sqlalchemy import create_engine, func

from sqlalchemy.orm import sessionmaker

#from sqlalchemy.sql.expression import text 
#import gevent

import simplejson as json

class PG:
    
    def __init__(self):

        url =  'postgresql+psycopg2://postgres:py03thon@localhost:5432/maboss'

        engine = create_engine(url, echo=False)

        self.session = sessionmaker(bind=engine)()

    def execute(self, sql):
        
        #sql =  """  select state_start, state_stop, type from engine_test where createdon > '2013-10-09' and createdon < '2013-10-10'  and pk_engine_test_id = 207025  """

        return self.session.execute(sql)

    

class Json(object):
    
    def __init__(self):
        
        self.db  = PG()
        
        self.colors = {'0':'yellow','1':'greed','2':'yellow','3':'red'}
        
        
    def getData(self):
        
        sql = """ select state_start, state_stop, type from engine_test where createdon > '2013-12-24' and createdon < '2013-12-26'  """
        print sql
        rtn = self.db.execute(sql)
        
        return rtn.fetchall()
        
    
    def json(self, id):
        
        data = self.getData()
        
        jsondata = {}
        jsondata['wikiURL'] = "/timeline/"
        #jsondata['wikiSection'] = "index"
        jsondata['dateTimeFormat'] = 'iso8601'
        
        events = []
        
        for item in data:
            k = {}
            k['start'] = item[0].isoformat(' ')  
            #k['latestStart'] = item[1].isoformat(' ')  
            #k['earliestEnd'] = item[2].isoformat()  
            k['end'] = item[1].isoformat() 
            k['description'] =  'avl'
            k['title'] = 'a'
            
            k['color']=self.colors[item[2]]
            events.append(k)
            
            """
            k = {}
            k['start'] = item[2].isoformat()       
            k['end'] = item[3].isoformat() 
            k['title'] = '%s,%s [%s]'%(item[4],item[5], item[0])
            k['color']='green'
            events.append(k)
            """

            
        jsondata['events'] = events
        
        jstr = json.dumps(jsondata)
        
        filename = "id_%s.js" %(id)
        
        fh = open(filename, 'w')
        
        fh.write("var timeline_data ="+jstr)
        
        fh.close()


if __name__ == '__main__':
    vjson = Json()
    
    #10006148, 10006229
    
    id = 11127098
     
    vjson.json(id)

 