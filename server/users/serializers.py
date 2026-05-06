from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True, 
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['username', 'password', 'password_confirm', 'email', 'is_admin', 'company']

    def validate(self, data):
        """
        Check that the two passwords match.
        """
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            is_admin=validated_data.get('is_admin', False),
            company=validated_data.get('company', '')
        )
        return user