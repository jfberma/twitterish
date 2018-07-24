from rest_framework import serializers

from api.accounts.serializers import UserSerializer
from api.feed.models import Post


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Post

        fields = ('id', 'user', 'content', 'created_at',)
