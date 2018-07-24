from friendship.models import Follow
from rest_framework.authtoken.models import Token

from api.accounts.models import TwitterishUser
from api.feed.models import Post


def get_user_from_auth_header(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if auth_header is not None:
        token = auth_header.split(" ")[1]
        user = Token.objects.get(key=token).user
        return user
    return None


def has_access_to_feed(request, feed_user):
    if feed_user.private:
        user = get_user_from_auth_header(request)
        if user:
            following = Follow.objects.following(user)
            if feed_user in following or user.pk == feed_user.pk:
                return True
            else:
                return False
        else:
            return False

    return True


'''
Testing Utils
'''


def build_test_user():
    user = TwitterishUser.objects.create_user("name", "email", "password")

    token = Token()
    token.user = user
    token.key = "123456789"
    token.save()

    return user, token


def build_test_post(user, content):
    post = Post()
    post.user = user
    post.content = content
    post.save()

    return post
