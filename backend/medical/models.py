from django.conf import settings
from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Hospital(TimestampedModel):
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True)
    city = models.CharField(max_length=120)
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.code})"


class ChildProfile(TimestampedModel):
    class Gender(models.TextChoices):
        FEMALE = "fille", "Fille"
        MALE = "garcon", "Garcon"
        OTHER = "autre", "Autre"

    parent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="children",
    )
    assigned_doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_children",
    )
    hospital = models.ForeignKey(
        Hospital,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="children",
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField()
    gender = models.CharField(max_length=10, choices=Gender.choices)
    blood_type = models.CharField(max_length=5, blank=True)
    allergies = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.first_name} {self.last_name}".strip()


class VaccineCatalog(TimestampedModel):
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    recommended_age = models.CharField(max_length=100, blank=True)
    doses_required = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class VaccinationRecord(TimestampedModel):
    class Status(models.TextChoices):
        UPCOMING = "upcoming", "A venir"
        DONE = "done", "Effectue"
        MISSED = "missed", "Manque"

    child = models.ForeignKey(
        ChildProfile,
        on_delete=models.CASCADE,
        related_name="vaccinations",
    )
    vaccine = models.ForeignKey(
        VaccineCatalog,
        on_delete=models.CASCADE,
        related_name="records",
    )
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="vaccination_records",
    )
    hospital = models.ForeignKey(
        Hospital,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="vaccination_records",
    )
    scheduled_date = models.DateField()
    administered_at = models.DateField(null=True, blank=True)
    dose_number = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UPCOMING)
    note = models.TextField(blank=True)

    class Meta:
        ordering = ["scheduled_date"]

    def __str__(self):
        return f"{self.child} - {self.vaccine}"


class Appointment(TimestampedModel):
    class Status(models.TextChoices):
        PLANNED = "planned", "Planifie"
        COMPLETED = "completed", "Termine"
        CANCELLED = "cancelled", "Annule"

    child = models.ForeignKey(
        ChildProfile,
        on_delete=models.CASCADE,
        related_name="appointments",
    )
    hospital = models.ForeignKey(
        Hospital,
        on_delete=models.CASCADE,
        related_name="appointments",
    )
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="appointments",
    )
    appointment_date = models.DateTimeField()
    reason = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNED)

    class Meta:
        ordering = ["appointment_date"]

    def __str__(self):
        return f"{self.child} - {self.appointment_date:%Y-%m-%d %H:%M}"


class Reminder(TimestampedModel):
    class Channel(models.TextChoices):
        EMAIL = "email", "Email"
        SMS = "sms", "SMS"
        PUSH = "push", "Push"

    child = models.ForeignKey(
        ChildProfile,
        on_delete=models.CASCADE,
        related_name="reminders",
    )
    vaccination_record = models.ForeignKey(
        VaccinationRecord,
        on_delete=models.CASCADE,
        related_name="reminders",
        null=True,
        blank=True,
    )
    send_at = models.DateTimeField()
    channel = models.CharField(max_length=10, choices=Channel.choices, default=Channel.PUSH)
    sent = models.BooleanField(default=False)
    message = models.TextField(blank=True)

    class Meta:
        ordering = ["send_at"]

    def __str__(self):
        return f"Reminder {self.child} - {self.send_at:%Y-%m-%d %H:%M}"
