import requests

from django.contrib.auth import get_user_model
from django.core.management import BaseCommand

User = get_user_model()
FAKE_USER_COUNT = 10
RANDOM_USER_API_ENDPOINT = "https://randomuser.me/api/"


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            dest='count',
            help='Specifies the amount of fake users to create (default {})'.format(
                FAKE_USER_COUNT)
        )

    def handle(self, *args, **options):
        count = options.get('count')
        if count is None:
            count = FAKE_USER_COUNT

        resp = requests.get(url=RANDOM_USER_API_ENDPOINT,
                            params={'results': count})

        for result in resp.json().get('results'):
            login = result.get('login')
            name = result.get('name')
            first_name = name.get('first')
            last_name = name.get('last')
            username = login.get('username')
            password = login.get('password')
            email = result.get('email')
            user = User(username=username, password=password, email=email,
                        first_name=first_name, last_name=last_name)
            user.save()
            print('Created user {}'.format(username))
