from rest_framework import serializers

from api.accounts.models import TwitterishUser


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = TwitterishUser

        fields = ('id', 'username', 'first_name', 'last_name', 'private')
