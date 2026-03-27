from rest_framework import permissions, viewsets

from .models import Appointment, ChildProfile, Hospital, Reminder, VaccinationRecord, VaccineCatalog
from .serializers import (
    AppointmentSerializer,
    ChildProfileSerializer,
    HospitalSerializer,
    ReminderSerializer,
    VaccinationRecordSerializer,
    VaccineCatalogSerializer,
)


class ScopedOwnerMixin:
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if user.role == "admin":
            return queryset

        if self.basename == "child":
            if user.role == "medecin":
                return queryset.filter(assigned_doctor=user)
            return queryset.filter(parent=user)

        if self.basename in {"vaccination", "appointment", "reminder"}:
            if user.role == "medecin":
                return queryset.filter(child__assigned_doctor=user)
            return queryset.filter(child__parent=user)

        return queryset


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [permissions.IsAuthenticated]


class ChildProfileViewSet(ScopedOwnerMixin, viewsets.ModelViewSet):
    queryset = ChildProfile.objects.select_related("parent", "assigned_doctor", "hospital")
    serializer_class = ChildProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(parent=self.request.user)


class VaccineCatalogViewSet(viewsets.ModelViewSet):
    queryset = VaccineCatalog.objects.all()
    serializer_class = VaccineCatalogSerializer
    permission_classes = [permissions.IsAuthenticated]


class VaccinationRecordViewSet(ScopedOwnerMixin, viewsets.ModelViewSet):
    queryset = VaccinationRecord.objects.select_related("child", "vaccine", "doctor", "hospital")
    serializer_class = VaccinationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]


class AppointmentViewSet(ScopedOwnerMixin, viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related("child", "hospital", "doctor")
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReminderViewSet(ScopedOwnerMixin, viewsets.ModelViewSet):
    queryset = Reminder.objects.select_related("child", "vaccination_record")
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]
