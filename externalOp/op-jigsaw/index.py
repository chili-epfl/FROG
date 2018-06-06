import spacy
from sklearn.cluster import KMeans
from operatorUtils import defineOperator

nlp = spacy.load('en_core_web_lg')

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

def operator(data, object):
    studentmapping = [k for k, v in object['activityData']['payload'].items()]
    texts = [v['data']['text'] for k, v in object['activityData']['payload'].items()]
    docs = [nlp(txt).vector for txt in texts]    
    kmeans = KMeans(n_clusters=2)
    kmeans.fit(docs)
    y_kmeans = kmeans.predict(docs)
    indices = [[i, k] for (i,k) in enumerate(y_kmeans)]
    roles = {}
    groups = {}

    for role in [1,2]:
        roles[str(role)] = [studentmapping[i] for (i,k) in indices if k == role-1]

    for group in [0,1]:
        groups[str(group)] = [roles['1'][group], roles['2'][group]]

    product = {'group': groups, 'role': roles}

    return product

defineOperator(operatorPackage, operator)
