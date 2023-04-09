from rest_framework import serializers
from Users.models import User, Department


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('DepartmentId',
                  'DepartmentName')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('UserId',
                  'UserName',
                  'Department',
                  'DateOfJoining',
                  'PhotoFileName')
