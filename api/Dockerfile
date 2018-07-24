FROM python:3.7
ENV PYTHONUNBUFFERED 1
RUN mkdir /config
RUN mkdir /var/log/api
ADD /config/api/requirements.pip /config/
RUN pip install -r /config/requirements.pip
RUN mkdir /api
WORKDIR /api