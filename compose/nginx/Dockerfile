FROM nginx:latest
RUN apt-get update && apt-get install nano
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.backup

ADD conf.d/ /etc/nginx/conf.d/
#FROM nginx:latest
#ADD nginx.conf /etc/nginx/nginx.conf
#
#ADD start.sh /start.sh
#ADD nginx-secure.conf /etc/nginx/nginx-secure.conf
#ADD dhparams.example.pem /etc/ssl/private/dhparams.pem
#CMD /start.sh