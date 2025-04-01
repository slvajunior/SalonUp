# admin_panel/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Owner


class OwnerAdmin(BaseUserAdmin):
    list_display = ("id", "username", "email", "is_active", "is_admin", "is_master")
    search_fields = ("username", "email")
    ordering = ("id",)
    filter_horizontal = ()
    list_filter = ("is_active", "is_admin", "is_master")

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Informações pessoais", {"fields": ("email", "name")}),
        ("Permissões", {"fields": ("is_active", "is_admin", "is_master")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "name", "password1", "password2", "is_active", "is_admin", "is_master"),
        }),
    )


admin.site.register(Owner, OwnerAdmin)
