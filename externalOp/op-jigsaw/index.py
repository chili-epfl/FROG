from operatorUtils import defineOperator

operatorPackage = {
    'id': 'op-jigsaw-ext',
    'type': 'social',
    'external': True,
    'outputDefinition': ['group', 'role'],
    'meta': {
        'name': 'Jigsaw external operator',
        'shortDesc': 'Generates roles and groups',
        'description': 'Written in Python'},
    'config': {
        'type': 'object',
        'properties': {
            'roles': {
                'type': 'string',
                'title': 'List roles, separated by comma'
            }
        }
    }
}

product = {"product":{"_id":"cjgpkhnaq0003oqsevcp206zg","type":"social","socialStructure":{"role":{"chef":["rAH23TKfQ6sBpqAaf","TxAQZynSLd3sDNe9K"],"baker":["Ji6F72uhZLRxSyxjd"]},"group":{"0":["rAH23TKfQ6sBpqAaf","Ji6F72uhZLRxSyxjd"],"1":["TxAQZynSLd3sDNe9K"]}}}}

def operator(data, object):
    print(data,object)
    return 11

defineOperator(operatorPackage, operator)
