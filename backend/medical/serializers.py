from rest_framework import serializers

from .models import Appointment, ChildProfile, Hospital, Reminder, VaccinationRecord, VaccineCatalog


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = "__all__"


class ChildProfileSerializer(serializers.ModelSerializer):
    parent_name = serializers.SerializerMethodField(read_only=True)
    parent_phone = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ChildProfile
        fields = "__all__"
        read_only_fields = ["parent"]

    def get_parent_name(self, obj):
        return obj.parent.get_full_name().strip() or obj.parent.email

    def get_parent_phone(self, obj):
        return obj.parent.phone


class VaccineCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccineCatalog
        fields = "__all__"


class VaccinationRecordSerializer(serializers.ModelSerializer):
    vaccine_name = serializers.CharField(source="vaccine.name", read_only=True)
    doctor_name = serializers.SerializerMethodField(read_only=True)
    hospital_name = serializers.CharField(source="hospital.name", read_only=True, default="")
    child_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = VaccinationRecord
        fields = "__all__"

    def get_doctor_name(self, obj):
        if obj.doctor:
            return obj.doctor.get_full_name().strip() or obj.doctor.email
        return ""

    def get_child_name(self, obj):
        return str(obj.child)


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField(read_only=True)
    hospital_name = serializers.CharField(source="hospital.name", read_only=True, default="")
    child_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"

    def get_doctor_name(self, obj):
        if obj.doctor:
            return obj.doctor.get_full_name().strip() or obj.doctor.email
        return ""

    def get_child_name(self, obj):
        return str(obj.child)


class ReminderSerializer(serializers.ModelSerializer):
    child_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Reminder
        fields = "__all__"

    def get_child_name(self, obj):
        return str(obj.child)
