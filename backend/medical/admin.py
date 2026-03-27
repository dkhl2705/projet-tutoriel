from django.contrib import admin

from .models import Appointment, ChildProfile, Hospital, Reminder, VaccinationRecord, VaccineCatalog

admin.site.register(Hospital)
admin.site.register(ChildProfile)
admin.site.register(VaccineCatalog)
admin.site.register(VaccinationRecord)
admin.site.register(Appointment)
admin.site.register(Reminder)
