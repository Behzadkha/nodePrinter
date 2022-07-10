#!/bin/bash
ipAddr=$(ifconfig | grep 'inet ' | cut -d ':' -f 2 | awk '{print $2}' | tail -n1)
sed -i 's/^IP.*/IP.1 = $ipAddr/g' openssl.cnf
openssl x509 -req -in tls.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out tls.crt -days 4000 -sha256 -extfile openssl.cnf