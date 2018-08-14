wget http://meteor-1/
wget http://meteor-2/
wget http://meteor-3/
wget http://meteor-4/
wget https://icchilisrv3.epfl.ch

node ../frog/sharedb/test_sharedb_instance.js ws://sharedb-1:3002
node ../frog/sharedb/test_sharedb_instance.js ws://sharedb-2:3002
node ../frog/sharedb/test_sharedb_instance.js ws://sharedb-3:3002
node ../frog/sharedb/test_sharedb_instance.js ws://sharedb-4:3002
node ../frog/sharedb/test_sharedb_instance.js wss://icchilisrv3.epfl.ch:3002
