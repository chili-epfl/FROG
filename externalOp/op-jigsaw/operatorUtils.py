import redis
import json

def defineOperator(operatorPackage, operator):
    r = redis.StrictRedis(host='localhost', port=6379, db=0)
    p = r.pubsub(ignore_subscribe_messages=True)
    operatorJSON = json.dumps(
        {
            'msgType': 'operatorPackage', 
            'payload': operatorPackage 
        }
    )

    def sendOperator(msg): 
        if json.loads(msg['data'])['msgType'] == 'who-is-here':
            r.publish('frog.control', operatorJSON)

    p.subscribe(**{'frog.control': sendOperator})
    thread = p.run_in_thread(sleep_time=0.001)

    r.publish('frog.control', operatorJSON)
    print('Waiting for incoming operator calls for ' + operatorPackage['id'])
    while True:
        incoming = r.blpop('frog.operator.' + operatorPackage['id'])
        msg = json.loads(incoming[1])
        print(msg)
        try:
            if(msg['msgType'] == 'run'):
                r.rpush('frog.external.'+msg['callback'], json.dumps({'msgType': 'product', 'payload': operator(msg['data'], msg['object'])}))
        except:
            pass

