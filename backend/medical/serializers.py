from rest_framework import serializers

from .models import Appointment, ChildProfile, Hospital, Reminder, VaccinationRecord, VaccineCatalog


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = "__all__"


class ChildProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildProfile
        fields = "__all__"
        read_only_fields = ["parent"]


class VaccineCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccineCatalog
        fields = "__all__"


class VaccinationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccinationRecord
        fields = "__all__"


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = "__all__"
