import type { Translations } from "./global";

const translations: Translations = {
  "giftCard": {
    "title": "Gift Card Management",
    "description": "Manage gift card templates, redemption codes, and usage records.",
    "tabs": {
      "templates": "Template Management",
      "codes": "Redemption Code Management",
      "usages": "Usage Records",
      "statistics": "Statistics"
    },
    "template": {
      "title": "Template Management",
      "description": "Manage gift card templates, including creating, editing, and deleting templates.",
      "table": {
        "title": "Template List",
        "columns": {
          "id": "ID",
          "name": "Name",
          "type": "Type",
          "status": "Status",
          "sort": "Sort",
          "rewards": "Rewards",
          "created_at": "Created At",
          "actions": "Actions",
          "no_rewards": "No Rewards"
        }
      },
      "form": {
        "add": "Add Template",
        "edit": "Edit Template",
        "name": {
          "label": "Template Name",
          "placeholder": "Please enter template name",
          "required": "Please enter template name"
        },
        "sort": {
          "label": "Sort",
          "placeholder": "Smaller numbers appear first"
        },
        "type": {
          "label": "Type",
          "placeholder": "Please select gift card type"
        },
        "description": {
          "label": "Description",
          "placeholder": "Please enter gift card description"
        },
        "status": {
          "label": "Status",
          "description": "When disabled, this template cannot generate or redeem new gift cards."
        },
        "display": {
          "title": "Display Effect",
          "theme_color": {
            "label": "Theme Color"
          },
          "icon": {
            "label": "Icon",
            "placeholder": "Please enter icon URL"
          },
          "background_image": {
            "label": "Background Image",
            "placeholder": "Please enter background image URL"
          }
        },
        "conditions": {
          "title": "Usage Conditions",
          "new_user_max_days": {
            "label": "New User Registration Days Limit",
            "placeholder": "Example: 7 (Only for users registered within 7 days)"
          },
          "new_user_only": {
            "label": "New Users Only",
            "hint": "Registration days ≤ {{days}}"
          },
          "paid_user_only": {
            "label": "Paid Users Only"
          },
          "require_invite": {
            "label": "Require Invitation Relationship"
          },
          "allowed_plans": {
            "label": "Allowed Plans",
            "placeholder": "Select plans allowed for redemption (leave empty for no restriction)"
          },
          "disallowed_plans": {
            "label": "Disallowed Plans",
            "placeholder": "Select plans forbidden for redemption (leave empty for no restriction)"
          }
        },
        "limits": {
          "title": "Usage Limits",
          "max_use_per_user": {
            "label": "Max Uses Per User",
            "placeholder": "Leave empty for no limit"
          },
          "cooldown_hours": {
            "label": "Cooldown Hours for Same Type",
            "placeholder": "Leave empty for no limit"
          }
        },
        "rewards": {
          "title": "Rewards",
          "invite_reward_rate": {
            "label": "Inviter Reward Rate",
            "placeholder": "Example: 0.2 (represents 20%)",
            "description": "When user has an inviter, inviter reward = balance reward × this rate"
          },
          "balance": {
            "label": "Reward Balance (Yuan)",
            "short_label": "Balance",
            "placeholder": "Please enter reward amount (Yuan)"
          },
          "transfer_enable": {
            "label": "Reward Traffic (GB)",
            "short_label": "Traffic",
            "placeholder": "Please enter reward traffic (GB)"
          },
          "expire_days": {
            "label": "Extend Validity (Days)",
            "short_label": "Validity",
            "placeholder": "Please enter extension days"
          },
          "transfer": {
            "label": "Reward Traffic (Bytes)",
            "placeholder": "Please enter reward traffic (bytes)"
          },
          "days": {
            "label": "Extend Validity (Days)",
            "placeholder": "Please enter extension days"
          },
          "device_limit": {
            "label": "Increase Device Count",
            "short_label": "Devices",
            "placeholder": "Please enter increased device count"
          },
          "reset_package": {
            "label": "Reset Monthly Traffic",
            "description": "When enabled, redemption will clear the user's current plan's used traffic."
          },
          "reset_count": {
            "description": "This type of card will reset the user's monthly traffic usage."
          },
          "task_card": {
            "description": "Specific rewards for task gift cards will be configured in the task system."
          },
          "plan_id": {
            "label": "Specified Plan",
            "short_label": "Plan",
            "placeholder": "Please select a plan"
          },
          "plan_validity_days": {
            "label": "Plan Validity (Days)",
            "short_label": "Plan Validity",
            "placeholder": "Leave empty to use plan default validity"
          },
          "random_rewards": {
            "label": "Random Reward Pool",
            "add": "Add Random Reward Item",
            "weight": "Weight"
          }
        },
        "special_config": {
          "title": "Special Configuration",
          "start_time": {
            "label": "Event Start Time",
            "placeholder": "Please select start date"
          },
          "end_time": {
            "label": "Event End Time",
            "placeholder": "Please select end date"
          },
          "festival_bonus": {
            "label": "Festival Reward Multiplier",
            "placeholder": "Example: 1.5 (represents 1.5x)"
          }
        },
        "submit": {
          "saving": "Saving...",
          "save": "Save"
        }
      },
      "actions": {
        "edit": "Edit",
        "delete": "Delete",
        "deleteConfirm": {
          "title": "Confirm Delete",
          "description": "This action will permanently delete this template. Are you sure you want to continue?",
          "confirmText": "Delete"
        }
      }
    },
    "code": {
      "title": "Redemption Code Management",
      "form": {
        "generate": "Generate Redemption Codes",
        "template_id": {
          "label": "Select Template",
          "placeholder": "Please select a template to generate redemption codes"
        },
        "count": {
          "label": "Generation Count"
        },
        "prefix": {
          "label": "Custom Prefix (Optional)"
        },
        "expires_hours": {
          "label": "Validity (Hours)"
        },
        "max_usage": {
          "label": "Max Usage Count"
        },
        "download_csv": "Export CSV",
        "submit": {
          "generating": "Generating...",
          "generate": "Generate Now"
        }
      },
      "description": "Manage gift card redemption codes, including generation, viewing, and exporting codes.",
      "generate": {
        "title": "Generate Redemption Codes",
        "template": "Select Template",
        "count": "Generation Count",
        "prefix": "Custom Prefix",
        "expires_hours": "Validity (Hours)",
        "max_usage": "Max Usage Count",
        "submit": "Generate"
      },
      "table": {
        "title": "Redemption Code List",
        "columns": {
          "id": "ID",
          "code": "Redemption Code",
          "template_name": "Template Name",
          "status": "Status",
          "expires_at": "Expires At",
          "usage_count": "Used Count",
          "max_usage": "Available Count",
          "created_at": "Created At"
        }
      },
      "actions": {
        "enable": "Enable",
        "disable": "Disable",
        "export": "Export",
        "exportConfirm": {
          "title": "Confirm Export",
          "description": "This will export all redemption codes from the selected batch as a text file. Are you sure you want to continue?",
          "confirmText": "Export"
        }
      },
      "status": {
        "0": "Unused",
        "1": "Used",
        "2": "Expired",
        "3": "Disabled"
      },
      "edit": {
        "title": "Edit gift code",
        "code": "Gift code",
        "template": "Template",
        "templatePlaceholder": "Select a template",
        "maxUsage": "Max usage",
        "status": "Status",
        "expiresAt": "Expires at"
      },
      "messages": {
        "enabled": "Enabled",
        "disabled": "Disabled",
        "exportSuccess": "Export successful",
        "deleteConfirmTitle": "Confirm delete",
        "deleteConfirmDescription": "Delete gift code {{code}}? This cannot be undone.",
        "deleteSuccess": "Deleted",
        "selectTemplate": "Please select a template",
        "updateSuccess": "Updated"
      }
    },
    "usage": {
      "title": "Usage Records",
      "description": "View gift card usage records and detailed information.",
      "table": {
        "columns": {
          "id": "ID",
          "code": "Redemption Code",
          "template_name": "Template Name",
          "user_email": "User Email",
          "rewards_given": "Rewards Given",
          "invite_rewards": "Invitation Rewards",
          "multiplier_applied": "Multiplier Applied",
          "ip_address": "IP Address",
          "created_at": "Usage Time",
          "actions": "Actions"
        }
      },
      "actions": {
        "view": "View Details"
      }
    },
    "statistics": {
      "title": "Statistics",
      "description": "View gift card statistics and usage analysis.",
      "total": {
        "title": "Overall Statistics",
        "templates_count": "Total Templates",
        "active_templates_count": "Active Templates",
        "codes_count": "Total Redemption Codes",
        "used_codes_count": "Used Redemption Codes",
        "usages_count": "Usage Records"
      },
      "daily": {
        "title": "Daily Usage",
        "chart": "Usage Trend Chart"
      },
      "type": {
        "title": "Type Statistics",
        "chart": "Type Distribution Chart"
      },
      "dateRange": {
        "label": "Date Range",
        "start": "Start Date",
        "end": "End Date"
      }
    },
    "types": {
      "1": "General Gift Card",
      "2": "Plan Gift Card",
      "3": "Mystery Gift Card",
      "4": "Task Gift Card"
    },
    "common": {
      "search": "Search gift cards...",
      "reset": "Reset",
      "filter": "Filter",
      "export": "Export",
      "refresh": "Refresh",
      "back": "Back",
      "close": "Close",
      "confirm": "Confirm",
      "cancel": "Cancel",
      "enabled": "Enabled",
      "disabled": "Disabled",
      "loading": "Loading...",
      "noData": "No Data",
      "success": "Operation Successful",
      "error": "Operation Failed"
    },
    "messages": {
      "formInvalid": "Please check if the form input is correct",
      "templateCreated": "Template created successfully",
      "templateUpdated": "Template updated successfully",
      "templateDeleted": "Template deleted successfully",
      "codeGenerated": "Redemption codes generated successfully",
      "generateCodeFailed": "Failed to generate redemption codes",
      "codeStatusUpdated": "Redemption code status updated successfully",
      "updateCodeStatusFailed": "Failed to update redemption code status",
      "codesExported": "Redemption codes exported successfully",
      "createTemplateFailed": "Failed to create template",
      "updateTemplateFailed": "Failed to update template",
      "deleteTemplateFailed": "Failed to delete template",
      "loadDataFailed": "Failed to load data",
      "codesGenerated": "Redemption codes generated successfully"
    }
  },
  "user": {
    "manage": {
      "title": "User Management",
      "description": "Here you can manage users, including adding, deleting, editing, and querying operations."
    },
    "columns": {
      "is_admin": "Admin",
      "is_staff": "Staff",
      "id": "ID",
      "email": "Email",
      "online_count": "Online Devices",
      "status": "Status",
      "subscription": "Subscription",
      "plan_list": "Plans",
      "group": "Group",
      "used_traffic": "Used Traffic",
      "total_traffic": "Total Traffic",
      "expire_time": "Expire Time",
      "balance": "Balance",
      "commission": "Commission",
      "register_time": "Register Time",
      "invitee_email": "Invitee",
      "actions": "Actions",
      "next_reset_at": "Next Reset At",
      "device_limit": {
        "unlimited": "No device limit",
        "limited": "Maximum {{count}} devices allowed"
      },
      "status_text": {
        "normal": "Active",
        "banned": "Banned"
      },
      "online_status": {
        "online": "Currently Online",
        "never": "Never Online",
        "last_online": "Last Online: {{time}}",
        "offline_duration": {
          "days": "Offline Duration: {{count}}d",
          "hours": "Offline Duration: {{count}}h",
          "minutes": "Offline Duration: {{count}}m",
          "seconds": "Offline Duration: {{count}}s"
        }
      },
      "expire_status": {
        "permanent": "Permanent",
        "expired": "Expired {{days}} days ago",
        "remaining": "{{days}} days remaining"
      },
      "copy_email": "Copy email",
      "actions_menu": {
        "edit": "Edit",
        "view_details": "View Details",
        "assign_order": "Assign Order",
        "copy_url": "Copy Subscribe URL",
        "reset_secret": "Reset UUID & URL",
        "orders": "Orders",
        "invites": "Invites",
        "traffic_records": "Traffic Records",
        "login_history": "Login History",
        "reset_traffic": "Reset Traffic",
        "delete": "Delete",
        "delete_confirm_title": "Confirm Delete User",
        "delete_confirm_description": "This action will permanently delete user {{email}} and all associated data, including orders, coupons, traffic records, and support tickets. This action cannot be undone. Do you want to continue?"
      }
    },
    "filter": {
      "selected": "{{count}} selected",
      "clear_selection": "Clear selection",
      "no_results": "No results found.",
      "clear": "Clear filters",
      "search_placeholder": "Search...",
      "email_search": "Search user email...",
      "advanced": "Advanced Filter",
      "reset": "Reset Filter",
      "sheet": {
        "title": "Advanced Filter",
        "description": "Add one or more filter conditions to find users precisely",
        "conditions": "Filter Conditions",
        "add": "Add Condition",
        "condition": "Condition {{number}}",
        "field": "Select Field",
        "operator": "Select Operator",
        "value": "Enter Value",
        "value_number": "Enter Value ({{unit}})",
        "reset": "Reset",
        "apply": "Apply Filter"
      },
      "fields": {
        "email": "Email",
        "phone": "Phone Number",
        "id": "User ID",
        "plan_id": "Subscription",
        "transfer_enable": "Traffic",
        "total_used": "Used Traffic",
        "online_count": "Online Devices",
        "expired_at": "Expire Time",
        "uuid": "UUID",
        "token": "Token",
        "banned": "Account Status",
        "remark": "Remark",
        "inviter_email": "Inviter Email",
        "invite_user_id": "Inviter ID",
        "is_admin": "Admin",
        "is_staff": "Staff"
      },
      "operators": {
        "contains": "Contains",
        "eq": "Equals",
        "gt": "Greater Than",
        "lt": "Less Than"
      },
      "status": {
        "normal": "Normal",
        "banned": "Banned"
      },
      "boolean": {
        "true": "Yes",
        "false": "No"
      }
    },
    "generate": {
      "button": "Create User",
      "title": "Create User",
      "description_single": "Create a single account with a specified email",
      "description_batch": "Batch generate accounts with random emails",
      "form": {
        "email": "Email",
        "email_prefix": "Account (leave empty for batch generation)",
        "email_prefix_placeholder": "Leave empty for random batch generation",
        "email_domain": "Domain",
        "password": "Password",
        "password_placeholder": "Leave empty to use email as password",
        "expire_time": "Expire Time",
        "expire_time_placeholder": "Select user expire date, leave empty for permanent",
        "permanent": "Permanent",
        "subscription": "Subscription Plan",
        "subscription_none": "None",
        "generate_count": "Generate Count",
        "generate_count_placeholder": "Enter count for batch generation",
        "cancel": "Cancel",
        "submit": "Generate",
        "success": "Generated successfully",
        "download_csv": "Export as CSV file",
        "generated_count": "{{count}} accounts generated",
        "single_success_hint": "Account created. You can view and edit it in the user list.",
        "copy_all": "Copy all",
        "copy_email": "Copy email",
        "copy_subscribe": "Copy subscription",
        "result_password": "Password",
        "result_expire": "Expires"
      },
      "copy_line": {
        "email": "Email: {{value}}",
        "password": "Password: {{value}}",
        "expire": "Expires: {{value}}",
        "subscribe": "Subscription: {{value}}"
      },
      "csv": {
        "email": "Email",
        "password": "Password",
        "expire_time": "Expire Time",
        "uuid": "UUID",
        "created_at": "Created At",
        "subscribe_url": "Subscribe URL"
      }
    },
    "edit": {
      "button": "Edit User Info",
      "title": "User Management",
      "form": {
        "email": "Email",
        "phone_country": "Country/Region",
        "phone": "Phone Number",
        "phone_placeholder": "Please enter phone number",
        "email_placeholder": "Please enter email",
        "inviter_email": "Inviter Email",
        "inviter_email_placeholder": "Please enter email",
        "invite_user_id": "Inviter ID",
        "invite_user_id_placeholder": "Enter inviter user ID, leave empty to clear",
        "password": "Password",
        "password_placeholder": "Enter new password if you want to change it",
        "balance": "Balance",
        "balance_placeholder": "Please enter balance",
        "commission_balance": "Commission Balance",
        "commission_balance_placeholder": "Please enter commission balance",
        "upload": "Upload Traffic",
        "upload_placeholder": "Upload traffic",
        "download": "Download Traffic",
        "download_placeholder": "Download traffic",
        "total_traffic": "Total Traffic",
        "total_traffic_placeholder": "Please enter traffic",
        "expire_time": "Expire Time",
        "expire_time_placeholder": "Select user expire date, leave empty for permanent",
        "expire_time_specific": "Specific Time",
        "expire_time_today": "Set to end of today",
        "expire_time_permanent": "Permanent",
        "expire_time_1month": "One Month",
        "expire_time_3months": "Three Months",
        "expire_time_confirm": "Confirm",
        "subscription": "Subscription Plan",
        "subscription_none": "None",
        "plans": "Plans",
        "add_plan": "Add plan",
        "multi_plan_title": "Plan List (Multi-Plan Mode)",
        "multi_plan_hint": "When multi-plan mode is enabled, multiple active plans can be added. In single-plan mode only the first plan is shown.",
        "plan_item_plan": "Plan",
        "plan_item_expire": "Expires",
        "plan_item_speed_limit": "Speed Limit (Mbps)",
        "plan_item_speed_limit_placeholder": "Leave empty for no limit",
        "plan_item_permanent": "Permanent",
        "plan_item_add": "Add Plan",
        "plan_item_remove": "Remove",
        "account_status": "Account Status",
        "banned_hint": "User cannot log in or use subscription services",
        "normal_hint": "User can use all services normally",
        "commission_type": "Commission Type",
        "commission_type_system": "Follow System Settings",
        "commission_type_cycle": "Cycle Commission",
        "commission_type_onetime": "One-time Commission",
        "commission_rate": "Commission Rate",
        "commission_rate_placeholder": "Leave empty to follow site commission rate",
        "discount": "Exclusive Discount",
        "discount_placeholder": "Leave empty for no exclusive discount",
        "speed_limit": "Speed Limit",
        "speed_limit_placeholder": "Leave empty for no speed limit",
        "device_limit": "Device Limit",
        "device_limit_placeholder": "Leave empty for no device limit",
        "is_admin": "Is Admin",
        "is_staff": "Is Staff",
        "remarks": "Remarks",
        "remarks_placeholder": "Please enter remarks here",
        "cancel": "Cancel",
        "submit": "Submit",
        "success": "Modified successfully"
      }
    },
    "actions": {
      "title": "Actions",
      "send_email": "Send Email",
      "export_csv": "Export CSV",
      "traffic_reset_stats": "Traffic Reset Stats",
      "batch_ban": "Batch Ban",
      "confirm_ban": {
        "title": "Confirm Batch Ban",
        "filtered_description": "This action will ban all users that match your current filters. This action cannot be undone.",
        "all_description": "This action will ban all users in the system. This action cannot be undone.",
        "cancel": "Cancel",
        "confirm": "Confirm Ban",
        "banning": "Banning..."
      }
    },
    "messages": {
      "success": "Success",
      "error": "Error",
      "export": {
        "success": "Export successful",
        "failed": "Export failed"
      },
      "batch_ban": {
        "success": "Batch ban successful",
        "failed": "Batch ban failed"
      },
      "send_mail": {
        "success": "Email sent successfully",
        "failed": "Failed to send email",
        "required_fields": "Please fill in all required fields"
      },
      "reset_secret": {
        "success": "UUID & Token reset"
      }
    },
    "traffic_reset": {
      "title": "Traffic Reset",
      "description": "Reset traffic usage for user {{email}}",
      "tabs": {
        "reset": "Reset Traffic",
        "history": "Reset History"
      },
      "user_info": "User Information",
      "warning": {
        "title": "Important Notice",
        "irreversible": "Traffic reset operation is irreversible, please proceed with caution",
        "reset_to_zero": "After reset, user's upload and download traffic will be cleared to zero",
        "logged": "All reset operations will be logged in the system"
      },
      "reason": {
        "label": "Reset Reason",
        "placeholder": "Please enter the reason for traffic reset (optional)",
        "optional": "This field is optional and used to record the reason for reset"
      },
      "confirm_reset": "Confirm Reset",
      "resetting": "Resetting...",
      "reset_success": "Traffic reset successful",
      "reset_failed": "Traffic reset failed",
      "history": {
        "summary": "Reset Overview",
        "reset_count": "Reset Count",
        "last_reset": "Last Reset",
        "next_reset": "Next Reset",
        "never": "Never Reset",
        "no_schedule": "No Scheduled Reset",
        "records": "Reset Records",
        "recent_records": "Recent 10 Reset Records",
        "no_records": "No reset records",
        "reset_time": "Reset Time",
        "traffic_cleared": "Traffic Cleared"
      },
      "stats": {
        "title": "Traffic Reset Statistics",
        "description": "View system traffic reset statistics",
        "time_range": "Statistics Time Range",
        "total_resets": "Total Resets",
        "auto_resets": "Auto Resets",
        "manual_resets": "Manual Resets",
        "cron_resets": "Cron Resets",
        "in_period": "In the last {{days}} days",
        "breakdown": "Reset Type Breakdown",
        "breakdown_description": "Percentage breakdown of different reset operation types",
        "auto_percentage": "Auto Reset Percentage",
        "manual_percentage": "Manual Reset Percentage",
        "cron_percentage": "Cron Reset Percentage",
        "days_options": {
          "week": "Last Week",
          "month": "Last Month",
          "quarter": "Last Quarter",
          "year": "Last Year"
        }
      }
    },
    "traffic_reset_logs": {
      "title": "Traffic Reset Logs",
      "description": "View detailed records of all traffic reset operations in the system",
      "columns": {
        "id": "Log ID",
        "user": "User",
        "reset_type": "Reset Type",
        "trigger_source": "Trigger Source",
        "cleared_traffic": "Cleared Traffic",
        "cleared": "Cleared",
        "upload": "Upload",
        "download": "Download",
        "reset_time": "Reset Time",
        "log_time": "Log Time"
      },
      "filters": {
        "search_user": "Search user email...",
        "reset_type": "Reset Type",
        "trigger_source": "Trigger Source",
        "all_types": "All Types",
        "all_sources": "All Sources",
        "start_date": "Start Date",
        "end_date": "End Date",
        "apply_date": "Apply Filter",
        "reset": "Reset Filter",
        "filter_title": "Filter Options",
        "filter_description": "Set filter conditions to find specific traffic reset records",
        "reset_types": {
          "monthly": "Monthly Reset",
          "first_day_month": "First Day of Month Reset",
          "yearly": "Yearly Reset",
          "first_day_year": "First Day of Year Reset",
          "manual": "Manual Reset"
        },
        "trigger_sources": {
          "auto": "Auto Trigger",
          "manual": "Manual Trigger",
          "cron": "Cron Job"
        }
      },
      "actions": {
        "export": "Export Logs",
        "exporting": "Exporting...",
        "export_success": "Export successful",
        "export_failed": "Export failed"
      },
      "trigger_descriptions": {
        "manual": "Manually executed traffic reset by administrator",
        "cron": "Automatically executed by system scheduled task",
        "auto": "Automatically triggered by system based on conditions",
        "other": "Triggered by other methods"
      }
    },
    "login_history": {
      "title": "Login History",
      "no_records": "No login records",
      "columns": {
        "time": "Time",
        "ip": "IP",
        "method": "Method",
        "user_agent": "User-Agent"
      },
      "methods": {
        "password": "Password",
        "register": "Register",
        "mail_link": "Mail Link"
      }
    },
    "send_mail": {
      "title": "Send Email",
      "description": "Send email to selected or filtered users",
      "subject": "Subject",
      "content": "Content",
      "sending": "Sending...",
      "send": "Send"
    },
    "dialog": {
      "title": "User Details",
      "basicInfo": "Basic Information",
      "subscriptionInfo": "Subscription Information",
      "trafficInfo": "Traffic Information",
      "financialInfo": "Financial Information",
      "activityInfo": "Activity Information",
      "inviteInfo": "Invitation Information",
      "timeInfo": "Time Information",
      "subscriptionUrl": "Subscription URL",
      "fields": {
        "userId": "User ID",
        "email": "Email",
        "phone": "Phone Number",
        "uuid": "UUID",
        "token": "Token",
        "remarks": "Remarks",
        "subscriptionPlan": "Subscription Plan",
        "permissionGroup": "Permission Group",
        "expiredAt": "Expired At",
        "deviceLimit": "Device Limit",
        "speedLimit": "Speed Limit",
        "transferEnable": "Total Traffic",
        "uploadUsed": "Upload Used",
        "downloadUsed": "Download Used",
        "totalUsed": "Total Used",
        "lastResetAt": "Last Reset",
        "nextResetAt": "Next Reset",
        "resetCount": "Reset Count",
        "balance": "Balance",
        "commissionBalance": "Commission Balance",
        "commissionType": "Commission Type",
        "commissionRate": "Commission Rate",
        "lastLoginAt": "Last Login",
        "lastLoginIp": "Last Login IP",
        "registerIp": "Register IP",
        "lastOnlineAt": "Last Online",
        "onlineCount": "Online Devices",
        "inviteUser": "Inviter",
        "inviteUserId": "Inviter ID",
        "createdAt": "Created At",
        "updatedAt": "Updated At",
        "subscribeUrl": "Subscription URL",
        "telegramId": "Telegram ID"
      }
    },
    "status": {
      "normal": "Normal",
      "banned": "Banned",
      "admin": "Admin",
      "staff": "Staff"
    }
  },
  "nav": {
    "dashboard": "Dashboard",
    "systemManagement": "System Management",
    "systemConfig": "System Configuration",
    "themeConfig": "Theme Configuration",
    "noticeManagement": "Notice Management",
    "pluginManagement": "Plugin Management",
    "paymentConfig": "Payment Configuration",
    "knowledgeManagement": "Knowledge Management",
    "nodeManagement": "Node Management",
    "machineManagement": "Server Management",
    "permissionGroupManagement": "Permission Group",
    "routeManagement": "Route Management",
    "subscriptionManagement": "Subscription",
    "planManagement": "Plan Management",
    "orderManagement": "Order Management",
    "couponManagement": "Coupon Management",
    "giftCardManagement": "Gift Card Management",
    "userManagement": "User Management",
    "trafficResetLogs": "Traffic Reset Logs",
    "ticketManagement": "Ticket Management",
    "withdrawalManagement": "Withdrawal Management",
    "pluginApps": "Plugin Apps",
    "pluginMenuDemo": "Plugin Menu (Demo)"
  },
  "subscribe": {
    "plan": {
      "title": "Subscription Plans",
      "add": "Add Plan",
      "search": "Search plans...",
      "sort": {
        "edit": "Edit Sort",
        "save": "Save Sort"
      },
      "columns": {
        "id": "ID",
        "show": "Show",
        "sell": "Sell",
        "renew": "Renew",
        "renew_tooltip": "Whether existing users can renew when the subscription stops selling",
        "name": "Name",
        "users": "Total Users",
        "active_users": "Active Users",
        "stats": "Statistics",
        "group": "Permission Group",
        "price": "Price",
        "actions": "Actions",
        "edit": "Edit",
        "delete": "Delete",
        "delete_confirm": {
          "title": "Confirm Delete",
          "description": "This action will permanently delete this subscription and cannot be undone. Are you sure you want to continue?",
          "success": "Successfully deleted"
        },
        "price_period": {
          "hourly": "Hourly",
          "daily": "Daily",
          "monthly": "Monthly",
          "quarterly": "Quarterly",
          "half_yearly": "Half Yearly",
          "yearly": "Yearly",
          "two_yearly": "Two Years",
          "three_yearly": "Three Years",
          "onetime": "One Time",
          "reset_traffic": "Reset Traffic",
          "no_price": "No Price",
          "unit": {
            "hour": "/hour",
            "day": "/day",
            "month": "/month",
            "quarter": "/quarter",
            "half_year": "/half year",
            "year": "/year",
            "two_year": "/2 years",
            "three_year": "/3 years",
            "times": "/time"
          }
        }
      },
      "form": {
        "add_title": "Add Plan",
        "edit_title": "Edit Plan",
        "name": {
          "label": "Plan Name",
          "placeholder": "Enter plan name",
          "required": "Plan name is required"
        },
        "group": {
          "label": "Permission Group",
          "add": "Add permission group",
          "placeholder": "Select a permission group",
          "none": "No permission group"
        },

        "transfer": {
          "label": "Traffic",
          "placeholder": "Enter traffic limit",
          "unit": "GB",
          "hint": "Included traffic quota in GB"
        },
        "speed": {
          "label": "Speed Limit",
          "placeholder": "0 = unlimited",
          "unit": "Mbps",
          "hint": "Per-user speed limit; 0 or empty means unlimited"
        },
        "price": {
          "title": "Price Settings",
          "base_price": "Base Price",
          "clear": {
            "button": "Clear",
            "tooltip": "Clear all prices"
          },
          "period": {
            "monthly": "Monthly",
            "months": "{{count}} Months"
          },
          "onetime_desc": "One-time traffic package, no time limit",
          "reset_desc": "Reset traffic package, can be used multiple times"
        },
        "device": {
          "label": "Device Limit",
          "placeholder": "0 = unlimited",
          "unit": "Devices",
          "hint": "Concurrent devices; 0 or empty means unlimited"
        },
        "capacity": {
          "label": "Capacity Limit",
          "placeholder": "0 = unlimited",
          "unit": "Users",
          "hint": "Max seats for sale; 0 or empty means unlimited"
        },
        "tags": {
          "label": "Tags",
          "placeholder": "Enter a tag and press Enter to confirm"
        },
        "reset_method": {
          "label": "Traffic Reset Method",
          "placeholder": "Select reset method",
          "description": "Traffic reset method will determine how the traffic is reset",
          "options": {
            "follow_system": "Follow System Settings",
            "monthly_first": "Monthly First Day",
            "monthly_reset": "Monthly Purchase Day",
            "no_reset": "No Reset",
            "yearly_first": "Yearly First Day",
            "yearly_reset": "Yearly Purchase Day"
          }
        },
        "content": {
          "label": "Plan Description",
          "placeholder": "Enter plan description",
          "description": "Support Markdown format",
          "preview": "Preview",
          "preview_button": {
            "show": "Show Preview",
            "hide": "Hide Preview"
          },
          "template": {
            "button": "Use Template",
            "tooltip": "Use default template",
            "content": "## Plan Details\n\n- Data: {{transfer}} GB\n- Speed Limit: {{speed}} Mbps\n- Concurrent Devices: {{devices}}\n\n## Service Information\n\n1. Data {{reset_method}}\n2. Multi-platform Support\n3. 24/7 Technical Support"
          }
        },
        "section": {
          "basic": "Basic info",
          "limits": "Quota & limits",
          "content": "Description",
          "status": "Availability"
        },
        "status": {
          "show_desc": "Show this plan on the storefront",
          "sell_desc": "Allow new purchases of this plan",
          "renew_desc": "Allow existing users to renew"
        },
        "force_update": {
          "label": "Force Update User Plans",
          "description": "When enabled, saving will overwrite this plan's users' group, transfer, speed limit and device limit with the current values. Only applies when editing an existing plan."
        },
        "submit": {
          "cancel": "Cancel",
          "submit": "Submit",
          "submitting": "Submitting...",
          "success": {
            "add": "Plan added successfully",
            "update": "Plan updated successfully"
          },
          "error": {
            "validation": "Form validation failed. Please check for errors and try again."
          }
        }
      },
      "page": {
        "description": "Here you can configure subscription plans, including adding, deleting, and editing operations."
      }
    }
  },
  "settings": {
    "title": "System Settings",
    "description": "Manage core system configurations, including site, security, subscription, invite commission, nodes, email, and notifications",
    "server": {
      "title": "Server Configuration",
      "description": "Configure node communication and synchronization settings, including communication keys, polling intervals, load balancing and other advanced options.",
      "server_token": {
        "title": "Communication Token",
        "placeholder": "Enter communication token",
        "description": "Used for authentication between servers",
        "generate_tooltip": "Click to generate random token"
      },
      "server_pull_interval": {
        "title": "Node Pull Action Polling Interval",
        "description": "The frequency at which nodes retrieve data from the panel.",
        "placeholder": "Enter pull interval"
      },
      "server_push_interval": {
        "title": "Node Push Action Polling Interval",
        "description": "The frequency at which nodes push data to the panel.",
        "placeholder": "Enter push interval"
      },
      "device_limit_mode": {
        "title": "Device Limit Mode",
        "description": "In relaxed mode, using multiple nodes from the same IP address counts as one device.",
        "strict": "Strict Mode",
        "relaxed": "Relaxed Mode",
        "placeholder": "Select device limit mode"
      },
      "server_ws_enable": {
        "title": "Enable WebSocket Communication",
        "description": "When enabled, nodes will communicate with the panel via WebSocket for lower latency and more timely pushes.",
        "supported_clients": "Node clients that currently support WebSocket communication: Fboard-Node"
      },
      "server_ws_url": {
        "title": "WebSocket URL",
        "description": "The WebSocket address nodes use to connect to the panel. Leave empty to use the site URL.",
        "placeholder": "Leave empty to use site URL"
      },
      "server_ws_log_enable": {
        "title": "WebSocket Debug Logging",
        "description": "When enabled, logs [WS] events such as node/machine connect, full sync, and pushes. Off by default to avoid log spam with many nodes; warnings always write. Changes take effect within a few seconds without restart."
      },
      "node_install_script_url": {
        "title": "Node Install Script URL",
        "description": "Custom URL for the node installation script. Leave empty to use the default GitHub URL.",
        "placeholder": "Leave empty to use default URL"
      },
      "utls_fingerprints": {
        "title": "uTLS Fingerprint List",
        "description": "Concrete fingerprint options for “uTLS → fingerprint” when editing a node. Supports chrome / firefox / safari / ios / android / edge / qq, or any name your clients accept. random (pick at subscribe time) and randomized (client-side random) are always provided by the system and are not configured here.",
        "placeholder": "Type a fingerprint name and press Enter, e.g. chrome"
      },
      "saving": "Saving...",
      "manage": {
        "description": "Manage all nodes, including add, delete, and edit operations.",
        "title": "Node Management"
      }
    },
    "invite": {
      "title": "Invitation & Commission Settings",
      "description": "Configure invitation registration and commission related settings.",
      "invite_force": {
        "title": "Enable Forced Invitation",
        "description": "When enabled, only invited users can register."
      },
      "invite_commission": {
        "title": "Invitation Commission Percentage",
        "description": "Default global commission distribution ratio, you can configure individual ratios in user management.",
        "placeholder": "Enter commission percentage"
      },
      "invite_gen_limit": {
        "title": "Invitation Code Generation Limit",
        "description": "Maximum number of invitation codes a user can create",
        "placeholder": "Enter generation limit"
      },
      "invite_never_expire": {
        "title": "Never Expire Invitation Code",
        "description": "When enabled, invitation codes will not expire after use, otherwise they will expire after being used."
      },
      "commission_first_time": {
        "title": "First-time Commission Only",
        "description": "When enabled, commission will only be generated on the first payment of the invitee, can be configured individually in user management."
      },
      "commission_auto_check": {
        "title": "Automatic Commission Confirmation",
        "description": "When enabled, commission will be automatically confirmed 3 days after order completion."
      },
      "commission_withdraw_limit": {
        "title": "Withdrawal Threshold (Yuan)",
        "description": "Withdrawal requests below this threshold will not be submitted.",
        "placeholder": "Enter withdrawal threshold"
      },
      "commission_withdraw_method": {
        "title": "Withdrawal Methods",
        "description": "Supported withdrawal methods, separate multiple methods with commas.",
        "placeholder": "Enter withdrawal methods, separate with commas"
      },
      "withdraw_close": {
        "title": "Disable Withdrawals",
        "description": "When enabled, users will be prohibited from requesting withdrawals, and invitation commissions will go directly to user balance."
      },
      "commission_distribution": {
        "title": "Three-level Distribution",
        "description": "When enabled, commission will be split according to the three set ratios, total should not exceed 100%.",
        "l1": "Level 1 Inviter Ratio",
        "l2": "Level 2 Inviter Ratio",
        "l3": "Level 3 Inviter Ratio",
        "placeholder": "Enter ratio e.g. 50"
      },
      "distribution_total": "Current distribution total: {{total}}% (should not exceed 100%)",
      "saving": "Saving..."
    },
    "site": {
      "title": "Site Settings",
      "description": "Configure basic site information, including site name, description, currency unit, and other core settings.",
      "form": {
        "siteName": {
          "label": "Site Name",
          "placeholder": "Please enter site name",
          "description": "Used where site name needs to be displayed."
        },
        "siteDescription": {
          "label": "Site Description",
          "placeholder": "Please enter site description",
          "description": "Used where site description needs to be displayed."
        },
        "siteUrl": {
          "label": "Site URL",
          "placeholder": "Please enter site URL, without trailing /",
          "description": "Current website URL, will be used in emails and other places where URL is needed."
        },
        "forceHttps": {
          "label": "Force HTTPS",
          "description": "Need to enable when the site is not using HTTPS but CDN or reverse proxy has forced HTTPS."
        },
        "maintenanceMode": {
          "label": "Maintenance Mode",
          "description": "When enabled, user state changes and proxy traffic are paused while administrators can still disable maintenance mode."
        },
        "logo": {
          "label": "Site LOGO",
          "placeholder": "Please enter LOGO URL, without trailing /",
          "description": "Used where LOGO needs to be displayed."
        },
        "subscribeUrl": {
          "label": "Subscribe URL",
          "placeholder": "Used for subscription, multiple URLs separated by ','. Leave empty to use site URL.",
          "description": "Used for subscription, leave empty to use site URL."
        },
        "tosUrl": {
          "label": "Terms of Service (TOS) URL",
          "placeholder": "Please enter TOS URL, without trailing /",
          "description": "Used to link to Terms of Service (TOS)"
        },
        "stopRegister": {
          "label": "Stop New User Registration",
          "description": "When enabled, no one will be able to register."
        },
        "ticketMustWaitReply": {
          "label": "Reply Wait Restriction",
          "description": "When enabled, users cannot continue sending messages in the same ticket until an administrator replies."
        },
        "tryOut": {
          "label": "Registration Trial Plan",
          "placeholder": "Select a plan",
          "description": "Select the subscription for trial, if no options please add in subscription management first.",
          "no_plan": "Disabled",
          "duration": {
            "label": "Trial Duration",
            "placeholder": "0",
            "description": "Trial duration in hours."
          }
        },
        "currency": {
          "label": "Currency Unit",
          "placeholder": "CNY",
          "description": "For display only, changing this will affect all currency units in the system."
        },
        "currencySymbol": {
          "label": "Currency Symbol",
          "placeholder": "¥",
          "description": "For display only, changing this will affect all currency symbols in the system."
        }
      }
    },
    "safe": {
      "title": "Security Settings",
      "description": "Configure system security options, including login verification, password policies, and API access settings.",
      "form": {
        "emailVerify": {
          "label": "Email Verification",
          "description": "When enabled, users will be required to verify their email."
        },
        "gmailLimit": {
          "label": "Disable Gmail Aliases",
          "description": "When enabled, Gmail aliases will not be allowed to register."
        },
        "safeMode": {
          "label": "Safe Mode",
          "description": "When enabled, accessing the site through domains other than the site URL will be blocked with 403."
        },
        "securePath": {
          "label": "Admin Path",
          "placeholder": "admin",
          "description": "Admin management path, changing this will modify the original admin path"
        },
        "emailWhitelist": {
          "label": "Email Suffix Whitelist",
          "description": "When enabled, only email suffixes in the list will be allowed to register.",
          "suffixes": {
            "label": "Email Suffixes",
            "placeholder": "Enter email suffixes, one per line",
            "description": "Enter the allowed email suffixes, one per line"
          }
        },
        "captcha": {
          "enable": {
            "label": "Enable Captcha",
            "description": "When enabled, users will need to pass captcha verification when registering."
          },
          "type": {
            "label": "Captcha Type",
            "description": "Select the captcha service type to use",
            "options": {
              "recaptcha": "Google reCAPTCHA v2",
              "recaptcha-v3": "Google reCAPTCHA v3",
              "turnstile": "Cloudflare Turnstile"
            }
          },
          "recaptcha": {
            "key": {
              "label": "reCAPTCHA Key",
              "placeholder": "Enter reCAPTCHA key",
              "description": "Enter your reCAPTCHA key"
            },
            "siteKey": {
              "label": "reCAPTCHA Site Key",
              "placeholder": "Enter reCAPTCHA site key",
              "description": "Enter your reCAPTCHA site key"
            }
          },
          "recaptcha_v3": {
            "secretKey": {
              "label": "reCAPTCHA v3 Key",
              "placeholder": "Enter reCAPTCHA v3 key",
              "description": "Enter your reCAPTCHA v3 server key"
            },
            "siteKey": {
              "label": "reCAPTCHA v3 Site Key",
              "placeholder": "Enter reCAPTCHA v3 site key",
              "description": "Enter your reCAPTCHA v3 site key"
            },
            "scoreThreshold": {
              "label": "Score Threshold",
              "placeholder": "0.5",
              "description": "Set verification score threshold (0-1), higher scores indicate more likely human behavior"
            }
          },
          "turnstile": {
            "secretKey": {
              "label": "Turnstile Key",
              "placeholder": "Enter Turnstile key",
              "description": "Enter your Cloudflare Turnstile key"
            },
            "siteKey": {
              "label": "Turnstile Site Key",
              "placeholder": "Enter Turnstile site key",
              "description": "Enter your Cloudflare Turnstile site key"
            }
          }
        },
        "registerLimit": {
          "enable": {
            "label": "IP Registration Limit",
            "description": "When enabled, the number of registrations from the same IP will be limited."
          },
          "count": {
            "label": "Registration Count",
            "placeholder": "Enter maximum registration count",
            "description": "Maximum number of registrations allowed from the same IP"
          },
          "expire": {
            "label": "Limit Duration",
            "placeholder": "Enter limit duration in minutes",
            "description": "Duration of the registration limit in minutes"
          }
        },
        "passwordLimit": {
          "enable": {
            "label": "Password Attempt Limit",
            "description": "When enabled, the number of password attempts will be limited."
          },
          "count": {
            "label": "Attempt Count",
            "placeholder": "Enter maximum attempt count",
            "description": "Maximum number of password attempts allowed"
          },
          "expire": {
            "label": "Lock Duration",
            "placeholder": "Enter lock duration in minutes",
            "description": "Duration of the account lock in minutes"
          }
        }
      }
    },
    "subscribe": {
      "title": "Subscription Settings",
      "description": "Manage subscription-related configurations, including subscription link format, update frequency, traffic statistics, and other settings.",
      "plan_change_enable": {
        "title": "Allow Subscription Changes",
        "description": "When enabled, users will be able to change their subscription plans."
      },
      "reset_traffic_method": {
        "title": "Monthly Traffic Reset Method",
        "description": "Global traffic reset method, defaults to the 1st of each month. Can be set individually for subscriptions in subscription management.",
        "options": {
          "monthly_first": "1st of Each Month",
          "monthly_reset": "Monthly Reset",
          "no_reset": "No Reset",
          "yearly_first": "January 1st",
          "yearly_reset": "Yearly Reset"
        }
      },
      "surplus_enable": {
        "title": "Enable Deduction Plan",
        "description": "When enabled, the system will deduct from the original subscription when users change subscriptions, refer to documentation for details."
      },
      "new_order_event": {
        "title": "Trigger Event on New Subscription",
        "description": "This task will be triggered when a new subscription is completed.",
        "options": {
          "no_action": "No Action",
          "reset_traffic": "Reset User Traffic"
        }
      },
      "renew_order_event": {
        "title": "Trigger Event on Subscription Renewal",
        "description": "This task will be triggered when a subscription renewal is completed.",
        "options": {
          "no_action": "No Action",
          "reset_traffic": "Reset User Traffic"
        }
      },
      "change_order_event": {
        "title": "Trigger Event on Subscription Change",
        "description": "This task will be triggered when a subscription change is completed.",
        "options": {
          "no_action": "No Action",
          "reset_traffic": "Reset User Traffic"
        }
      },
      "subscribe_path": {
        "title": "Subscription Path",
        "description": "Subscription path, modifying will change the original subscribe path",
        "current_format": "Current subscription path format: {path}/xxxxxxxxxx",
        "restart_tip": "You may need to restart the service for the new subscribe path to take effect."
      },
      "show_info_to_server": {
        "title": "Show Subscription Info in Nodes",
        "description": "When enabled, subscription information will be output when users subscribe to nodes."
      },
      "show_protocol_to_server": {
        "title": "Show Protocol in Node Names",
        "description": "When enabled, subscription lines will include protocol names (e.g., [Hy2]Hong Kong)"
      },
      "default_remind_expire": {
        "title": "Enable Expiry Reminder by Default",
        "description": "When enabled, newly registered users will have subscription expiry reminders turned on by default. Adjustable per user."
      },
      "default_remind_traffic": {
        "title": "Enable Traffic Reminder by Default",
        "description": "When enabled, newly registered users will have low-traffic reminders turned on by default. Adjustable per user."
      },
      "deposit_enable": {
        "title": "Enable Balance Deposit",
        "description": "When enabled, users can create balance deposit orders and top up after payment."
      },
      "deposit_commission_enable": {
        "title": "Deposit Orders Earn Invite Commission",
        "description": "When enabled, balance deposit orders are included in invite commission calculation."
      },
      "deposit_min_amount": {
        "title": "Minimum Deposit Amount (cents)",
        "description": "Minimum amount per deposit, in cents. For example, 100 means 1.00.",
        "placeholder": "100"
      },
      "deposit_max_amount": {
        "title": "Maximum Deposit Amount (cents)",
        "description": "Maximum amount per deposit, in cents.",
        "placeholder": "999999900"
      },
      "deposit_bonus": {
        "title": "Deposit Bonus Tiers",
        "description": "Format is threshold:bonus in major units, e.g. 100:10 means deposit 100 get 10 bonus. The highest matching tier is used.",
        "placeholder": "100:10"
      },
      "multi_plan_enable": {
        "title": "Allow Multiple Subscription Plans",
        "description": "When enabled, users can hold multiple active plans simultaneously. New purchases will be added alongside existing plans instead of replacing them."
      },
      "saving": "Saving...",
      "plan": {
        "title": "Subscription Plans",
        "add": "Add Plan",
        "search": "Search plans...",
        "sort": {
          "edit": "Edit Sort",
          "save": "Save Sort"
        },
        "columns": {
          "id": "ID",
          "show": "Show",
          "sell": "Sell",
          "renew": "Renew",
          "renew_tooltip": "Whether existing users can renew when the subscription stops selling",
          "name": "Name",
          "stats": "Statistics",
          "group": "Permission Group",
          "price": "Price",
          "actions": "Actions",
          "edit": "Edit",
          "delete": "Delete",
          "delete_confirm": {
            "title": "Confirm Delete",
            "description": "This action will permanently delete this subscription and cannot be undone. Are you sure you want to continue?",
            "success": "Successfully deleted"
          },
          "price_period": {
            "hourly": "Hourly",
            "daily": "Daily",
            "monthly": "Monthly",
            "quarterly": "Quarterly",
            "half_yearly": "Half Yearly",
            "yearly": "Yearly",
            "two_yearly": "Two Years",
            "three_yearly": "Three Years",
            "onetime": "One Time",
            "reset_traffic": "Reset Traffic",
            "unit": {
              "hour": "/hour",
              "day": "/day",
              "month": "/month",
              "quarter": "/quarter",
              "half_year": "/half year",
              "year": "/year",
              "two_year": "/2 years",
              "three_year": "/3 years",
              "times": "/time"
            }
          }
        },
        "form": {
          "add_title": "Add Plan",
          "edit_title": "Edit Plan",
          "name": {
            "label": "Plan Name",
            "placeholder": "Enter plan name"
          },
          "group": {
            "label": "Permission Group",
            "placeholder": "Select permission group",
            "add": "Add Group",
            "none": "No permission group"
          },
          "transfer": {
            "label": "Traffic",
            "placeholder": "Enter traffic size",
            "unit": "GB"
          },
          "speed": {
            "label": "Speed Limit",
            "placeholder": "Enter speed limit",
            "unit": "Mbps"
          },
          "price": {
            "title": "Price Settings",
            "base_price": "Base monthly price",
            "clear": {
              "button": "Clear Prices",
              "tooltip": "Clear all period price settings"
            }
          },
          "device": {
            "label": "Device Limit",
            "placeholder": "Leave empty for no limit",
            "unit": "devices"
          },
          "capacity": {
            "label": "Capacity Limit",
            "placeholder": "Leave empty for no limit",
            "unit": "users"
          },
          "reset_method": {
            "label": "Traffic Reset Method",
            "placeholder": "Select traffic reset method",
            "description": "Set how subscription traffic is reset, different methods affect how user traffic is calculated",
            "options": {
              "follow_system": "Follow System Settings",
              "monthly_first": "1st of Each Month",
              "monthly_reset": "Monthly Reset",
              "no_reset": "No Reset",
              "yearly_first": "January 1st",
              "yearly_reset": "Yearly Reset"
            }
          },
          "content": {
            "label": "Plan Description",
            "placeholder": "Write plan description here...",
            "description": "Supports Markdown format, you can use headings, lists, bold, italic and other styles to beautify the content",
            "preview": "Preview",
            "preview_button": {
              "show": "Show Preview",
              "hide": "Hide Preview"
            },
            "template": {
              "button": "Use Template",
              "tooltip": "Click to use preset plan description template",
              "content": "## Plan Features\n• High-speed and stable global network access\n• Support multiple devices online simultaneously\n• Unlimited traffic reset\n\n## Usage Instructions\n1. Supported devices: iOS, Android, Windows, macOS\n2. 24/7 technical support\n3. Automatic periodic traffic reset\n\n## Notes\n- No abuse allowed\n- Comply with local laws and regulations\n- Support plan changes anytime"
            }
          },
          "force_update": {
            "label": "Force Update to Users",
            "description": "When enabled, saving will sync this plan's users' group, transfer, speed limit and device limit with the current values."
          },
          "submit": {
            "submitting": "Submitting...",
            "submit": "Submit",
            "cancel": "Cancel",
            "success": {
              "add": "Plan added successfully",
              "update": "Plan updated successfully"
            }
          }
        },
        "page": {
          "description": "Here you can configure subscription plans, including adding, deleting, and editing operations."
        }
      }
    },
    "email": {
      "title": "Email Settings",
      "description": "Configure system email service for sending verification codes, password resets, and notifications, supporting various SMTP providers.",
      "tab_settings": "Settings",
      "tab_templates": "Templates",
      "email_host": {
        "title": "SMTP Host",
        "description": "SMTP server address, e.g., smtp.gmail.com",
        "placeholder": "smtp.example.com"
      },
      "email_port": {
        "title": "SMTP Port",
        "description": "SMTP server port, common ports: 25, 465, 587",
        "placeholder": "465"
      },
      "email_username": {
        "title": "SMTP Username",
        "description": "SMTP authentication username",
        "placeholder": "user@example.com"
      },
      "email_password": {
        "title": "SMTP Password",
        "description": "SMTP authentication password or application-specific password",
        "placeholder": "Enter password or app-specific password"
      },
      "email_encryption": {
        "title": "Encryption Method",
        "description": "Email encryption method",
        "placeholder": "Select encryption method",
        "none": "None",
        "ssl": "SSL/TLS",
        "tls": "STARTTLS"
      },
      "email_from_address": {
        "title": "From Address",
        "description": "Sender's email address",
        "placeholder": "noreply@example.com"
      },
      "email_from_name": {
        "title": "From Name",
        "description": "Sender's display name"
      },
      "email_template": {
        "title": "Email Template",
        "description": "You can check the documentation for how to customize email templates",
        "placeholder": "Select email template"
      },
      "remind_mail_enable": {
        "title": "Email Reminders",
        "description": "When enabled, users will receive email notifications when their subscription is about to expire or when traffic is running low."
      },
      "test": {
        "title": "Send Test Email",
        "sending": "Sending...",
        "description": "Send a test email to verify the configuration",
        "success": "Test email sent successfully",
        "error": "Failed to send test email",
        "label_to": "To",
        "label_subject": "Subject",
        "placeholder_to": "user@example.com",
        "placeholder_subject": "Test email subject"
      }
    },
    "telegram": {
      "title": "Telegram Settings",
      "description": "Configure Telegram bot functionality for user notifications, account binding, and command interactions.",
      "bot_token": {
        "title": "Bot Token",
        "description": "Please enter the token provided by Botfather.",
        "placeholder": "0000000000:xxxxxxxxx_xxxxxxxxxxxxxxx"
      },
      "webhook_url": {
        "title": "Webhook Base URL",
        "description": "Only provide the base URL here. The system will append the full Telegram webhook callback path automatically. Leave blank to use the site URL.",
        "docs": "View Telegram Webhook Docs",
        "placeholder": "https://example.com"
      },
      "webhook": {
        "title": "Set Webhook",
        "description": "Set up webhook for the bot. Without setting it, you won't receive Telegram notifications.",
        "button": "One-Click Setup",
        "setting": "Setting Webhook...",
        "success": "Webhook set successfully",
        "error": "Failed to set Webhook",
        "target_default": "The site URL will be used as the Webhook Base URL.",
        "target_custom": "The custom Webhook Base URL currently in use is: {{url}}",
        "debug": {
          "title": "Webhook Debug Info",
          "success": "Success",
          "url": "Webhook URL",
          "baseUrl": "Base URL"
        }
      },
      "bot_enable": {
        "title": "Enable Telegram Binding Guide",
        "description": "When enabled, a Telegram binding guide will be displayed on the user side to help users bind their Telegram accounts for notifications."
      },
      "discuss_link": {
        "title": "Group Link",
        "description": "Once filled in, it will be displayed on the user side or used where needed.",
        "placeholder": "https://t.me/xxxxxx"
      }
    },
    "app": {
      "title": "APP Settings",
      "description": "Manage mobile application configurations, including API interfaces, version control, and push notifications.",
      "common": {
        "placeholder": "Please input"
      },
      "windows": {
        "version": {
          "title": "Windows Version",
          "description": "Current version number of Windows client"
        },
        "download": {
          "title": "Windows Download URL",
          "description": "Download link for Windows client"
        }
      },
      "macos": {
        "version": {
          "title": "macOS Version",
          "description": "Current version number of macOS client"
        },
        "download": {
          "title": "macOS Download URL",
          "description": "Download link for macOS client"
        }
      },
      "android": {
        "version": {
          "title": "Android Version",
          "description": "Current version number of Android client"
        },
        "download": {
          "title": "Android Download URL",
          "description": "Download link for Android client"
        }
      }
    },
    "common": {
      "saving": "Saving...",
      "save": "Save",
      "save_success": "Saved successfully",
      "save_error": "Save failed",
      "reset": "Reset",
      "placeholder": "Please input",
      "autoSaved": "Auto-saved",
      "saved_at": "Saved {{seconds}}s ago",
      "invalidJson": "Invalid JSON"
    },
    "subscribe_template": {
      "title": "Subscribe Templates",
      "description": "Configure subscription templates for different clients (loaded on demand, save manually)",
      "unsaved_hint": "This template has unsaved changes. Click Save to apply.",
      "singbox": {
        "title": "Sing-box Template",
        "description": "Configure subscription template format for Sing-box"
      },
      "clash": {
        "title": "Clash Template",
        "description": "Configure subscription template format for Clash"
      },
      "clashmeta": {
        "title": "Clash Meta Template",
        "description": "Configure subscription template format for Clash Meta"
      },
      "stash": {
        "title": "Stash Template",
        "description": "Configure subscription template format for Stash"
      },
      "surge": {
        "title": "Surge Template",
        "description": "Configure subscription template format for Surge"
      },
      "surfboard": {
        "title": "Surfboard Template",
        "description": "Configure subscription template format for Surfboard"
      }
    },
    "email_template": {
      "title": "Email Templates",
      "description": "Customize the content of system email templates",
      "customized": "Customized",
      "subject": "Subject",
      "subject_placeholder": "Enter email subject, supports {{name}} placeholders",
      "content": "Template Content (HTML)",
      "preview": "Live Preview",
      "override_hint": "Saving will override the default system template. Click \"Reset to Default\" to restore the theme's default template at any time.",
      "placeholders": "Available Placeholders",
      "var_name": "Variable",
      "var_desc": "Description",
      "var_sample": "Sample Value",
      "required": "Required",
      "insert": "Insert",
      "placeholder_hint": "* marks required placeholders. Click to insert at the end of the content.",
      "click_to_insert": "Click to insert",
      "save": "Save",
      "save_success": "Template saved successfully",
      "save_before_test": "Please save changes before sending a test email",
      "send_test": "Send Test",
      "test_dialog_title": "Send Test Email",
      "test_dialog_description": "Enter recipient email address. Leave empty to send to your admin email.",
      "test_email_placeholder": "Recipient email (leave empty for current account)",
      "sending": "Sending...",
      "test_success": "Test email sent successfully",
      "reset": "Reset to Default",
      "reset_title": "Reset Template",
      "reset_description": "Are you sure you want to reset this template to default? Your customizations will be deleted.",
      "reset_confirm": "Confirm Reset",
      "reset_success": "Template reset to default",
      "unsaved": "Unsaved changes",
      "discard_title": "Unsaved Changes",
      "discard_description": "This template has unsaved changes. Switching tabs will discard them.",
      "discard_confirm": "Discard",
      "cancel": "Cancel"
    }
  },
  "notice": {
    "title": "Notice Management",
    "description": "Here you can configure notices, including adding, deleting, editing and other operations.",
    "table": {
      "columns": {
        "id": "ID",
        "show": "Display Status",
        "title": "Title",
        "actions": "Actions"
      },
      "toolbar": {
        "search": "Search notice title...",
        "reset": "Reset",
        "sort": {
          "edit": "Edit Order",
          "save": "Save Order"
        }
      },
      "actions": {
        "edit": "Edit",
        "delete": {
          "title": "Delete Confirmation",
          "description": "Are you sure you want to delete this notice? This action cannot be undone.",
          "success": "Successfully deleted"
        }
      }
    },
    "form": {
      "add": {
        "title": "Add Notice",
        "button": "Add Notice"
      },
      "edit": {
        "title": "Edit Notice"
      },
      "fields": {
        "title": {
          "label": "Title",
          "placeholder": "Please enter notice title"
        },
        "content": {
          "label": "Content"
        },
        "img_url": {
          "label": "Background Image",
          "placeholder": "Please enter notice background image URL"
        },
        "show": {
          "label": "Display"
        },
        "tags": {
          "label": "Tags",
          "placeholder": "Press Enter to add tags"
        }
      },
      "buttons": {
        "cancel": "Cancel",
        "submit": "Submit",
        "success": "Successfully submitted"
      }
    },
    "messages": {
      "loadError": "Failed to load notices"
    }
  },
  "group": {
    "title": "Permission Groups",
    "description": "Manage all permission groups, including adding, deleting, and editing operations.",
    "columns": {
      "id": "Group ID",
      "name": "Group Name",
      "usersCount": "Users Count",
      "serverCount": "Nodes Count",
      "actions": "Actions"
    },
    "form": {
      "add": "Add Group",
      "edit": "Edit Group",
      "create": "Create Group",
      "update": "Update",
      "name": "Group Name",
      "namePlaceholder": "Please enter group name",
      "nameDescription": "Group name is used to identify different user groups, it's recommended to use meaningful names.",
      "cancel": "Cancel",
      "editDescription": "Modify group information, changes will take effect immediately.",
      "createDescription": "Create a new permission group to assign different permissions to different users."
    },
    "toolbar": {
      "searchPlaceholder": "Search groups...",
      "reset": "Reset"
    },
    "messages": {
      "deleteConfirm": "Confirm Delete",
      "deleteDescription": "This action will permanently delete this permission group and cannot be recovered. Are you sure you want to continue?",
      "deleteButton": "Delete",
      "createSuccess": "Created Successfully",
      "updateSuccess": "Updated Successfully",
      "nameValidation": {
        "min": "Group name must be at least 2 characters",
        "max": "Group name cannot exceed 50 characters",
        "pattern": "Group name can only contain letters, numbers, Chinese characters, underscores and hyphens"
      }
    }
  },
  "auth": {
    "signIn": {
      "title": "Sign In",
      "description": "Enter your email and password to sign in",
      "email": "Email",
      "emailPlaceholder": "name@example.com",
      "password": "Password",
      "passwordPlaceholder": "Enter your password",
      "forgotPassword": "Forgot Password?",
      "submit": "Sign In",
      "rememberMe": "Remember me",
      "resetPassword": {
        "title": "Reset Password",
        "description": "Execute the following command in the site directory to reset your password",
        "command": "php artisan reset:password admin-email"
      },
      "validation": {
        "emailRequired": "Please enter your email address",
        "emailInvalid": "Please enter a valid email address",
        "passwordRequired": "Please enter your password",
        "passwordLength": "Password must be at least 7 characters"
      }
    }
  },
  "traffic": {
    "trafficRecord": {
      "title": "Traffic Usage Records",
      "time": "Time",
      "upload": "Upload",
      "download": "Download",
      "rate": "Rate",
      "total": "Total",
      "noRecords": "No records found",
      "perPage": "Show per page",
      "records": "records",
      "page": "Page {{current}} / {{total}}",
      "multiplier": "{{value}}x"
    }
  },
  "payment": {
    "title": "Payment Configuration",
    "description": "Configure payment methods including Alipay, WeChat Pay, etc.",
    "table": {
      "columns": {
        "id": "ID",
        "enable": "Enable",
        "name": "Display Name",
        "payment": "Payment Gateway",
        "notify_url": "Notify URL",
        "notify_url_tooltip": "The payment gateway will send notifications to this address. Please ensure it's accessible through your firewall.",
        "actions": "Actions"
      },
      "actions": {
        "edit": "Edit",
        "copy": "Copy",
        "copy_success": "Copied successfully",
        "delete": {
          "title": "Confirm Delete",
          "description": "Are you sure you want to delete this payment method? This action cannot be undone.",
          "success": "Successfully deleted"
        }
      },
      "toolbar": {
        "search": "Search payment methods...",
        "reset": "Reset",
        "sort": {
          "hint": "Drag payment methods to sort, click save when finished",
          "save": "Save Order",
          "edit": "Edit Order"
        }
      }
    },
    "form": {
      "add": {
        "button": "Add Payment Method",
        "title": "Add Payment Method"
      },
      "edit": {
        "title": "Edit Payment Method"
      },
      "fields": {
        "name": {
          "label": "Display Name",
          "placeholder": "Enter payment name",
          "description": "Used for frontend display"
        },
        "icon": {
          "label": "Icon URL",
          "placeholder": "https://example.com/icon.svg",
          "description": "Icon URL for frontend display"
        },
        "notify_domain": {
          "label": "Notify Domain",
          "placeholder": "https://example.com",
          "description": "Domain for gateway notifications"
        },
        "handling_fee_percent": {
          "label": "Percentage Fee (%)",
          "placeholder": "0-100"
        },
        "handling_fee_fixed": {
          "label": "Fixed Fee",
          "placeholder": "0"
        },
        "payment": {
          "label": "Payment Gateway",
          "placeholder": "Select payment gateway",
          "description": "Choose the payment gateway to use"
        }
      },
      "validation": {
        "name": {
          "min": "Name must be at least 2 characters",
          "max": "Name cannot exceed 30 characters"
        },
        "notify_domain": {
          "url": "Please enter a valid URL"
        },
        "payment": {
          "required": "Please select a payment gateway"
        }
      },
      "buttons": {
        "cancel": "Cancel",
        "submit": "Submit"
      },
      "sections": {
        "payment_config": "Payment Configuration"
      },
      "messages": {
        "success": "Saved successfully"
      },
      "config": {
        "title": "Payment Configuration",
        "noConfig": "No configuration for this payment method"
      }
    }
  },
  "server": {
    "title": "Node Configuration",
    "description": "Configure node communication and synchronization settings, including communication key, polling interval, load balancing and other advanced options.",
    "server_token": {
      "title": "Communication Key",
      "description": "The key for communication between Fboard and nodes to prevent unauthorized data access.",
      "placeholder": "Please enter communication key"
    },
    "server_pull_interval": {
      "title": "Node Pull Action Polling Interval",
      "description": "The frequency at which nodes retrieve data from the panel.",
      "placeholder": "Please enter pull interval"
    },
    "server_push_interval": {
      "title": "Node Push Action Polling Interval",
      "description": "The frequency at which nodes push data to the panel.",
      "placeholder": "Please enter push interval"
    },
    "device_limit_mode": {
      "title": "Device Limit Mode",
      "description": "In relaxed mode, multiple nodes from the same IP address count as one device.",
      "strict": "Strict Mode",
      "relaxed": "Relaxed Mode",
      "placeholder": "Please select device limit mode"
    },
    "saving": "Saving...",
    "manage": {
      "title": "Node Management",
      "description": "Manage all nodes, including adding, deleting, editing and other operations.",
      "filtered_by_server": "Viewing nodes hosted by {{server}} (SID:{{id}})",
      "filtered_by_server_description": "New nodes created here can directly reuse the current server as their deployment target.",
      "add_node_to_server": "Add node to this server",
      "clear_server_filter": "Clear server filter"
    },
    "columns": {
      "sort": "Sort",
      "nodeId": "Node ID",
      "show": "Show",
      "node": "Node",
      "address": "Address",
      "onlineUsers": {
        "title": "Online Users",
        "tooltip": "Online users count based on server reporting frequency",
        "sort_tip": "Sort by online users"
      },
      "rate": {
        "title": "Rate",
        "tooltip": "Traffic billing rate"
      },
      "traffic": {
        "title": "Traffic Usage",
        "tooltip": "Node traffic usage, showing used traffic and limit",
        "total": "Total",
        "used": "Used",
        "percentage": "Usage"
      },
      "groups": {
        "title": "Permission Groups",
        "tooltip": "Groups that can subscribe to this node",
        "empty": "--"
      },
      "loadStatus": {
        "title": "Load Status",
        "tooltip": "Server resource usage",
        "noData": "No Data",
        "details": "System Load Details",
        "cpu": "CPU Usage",
        "memory": "Memory Usage",
        "swap": "Swap Usage",
        "disk": "Disk Usage",
        "lastUpdate": "Last Updated",
        "metrics": {
          "title": "Metrics",
          "uptime": "Uptime",
          "conns": "Connections",
          "speed": "Speed",
          "api": "API Status",
          "gc": "GC Pause",
          "goroutines": "Goroutines",
          "kernel": "Kernel Status",
          "limit": "Limited Users",
          "load": "System Load",
          "users": "Online Users",
          "ws": "WebSocket"
        }
      },
      "version": "Version",
      "customId": "Custom ID",
      "originalId": "Original ID",
      "type": "Type",
      "actions": "Actions",
      "copyAddress": "Copy Connection Address",
      "internalPort": "Internal Port",
      "deployment": {
        "title": "Deployment",
        "tooltip": "Show whether a node runs standalone or is hosted by a server, and adjust it directly from the list.",
        "standalone": "Standalone",
        "standalone_row_hint": "Not bound to a server",
        "standalone_description": "This node runs independently without server hosting.",
        "online": "Online",
        "offline": "Offline",
        "inactive": "Server inactive",
        "disabled": "Node disabled",
        "enabled": "Enable on server",
        "enabled_description": "Only enabled nodes will be started and synced by the selected server.",
        "enabled_standalone_description": "Standalone nodes do not need a server-side enabled state.",
        "bind_success": "Hosted by {{server}}",
        "standalone_success": "Switched to standalone deployment",
        "update_success": "Deployment updated",
        "update_error": "Failed to update deployment"
      },
      "status": {
        "0": "Not Running",
        "1": "Unused or Abnormal",
        "2": "Running Normal"
      },
      "childNode": "Child Node",
      "actions_dropdown": {
        "edit": "Edit",
        "copy": "Copy",
        "reset_traffic": {
          "title": "Confirm Reset Traffic",
          "description": "This will reset the upload and download traffic to zero and unban the node. Are you sure you want to continue?",
          "confirm": "Reset Traffic"
        },
        "reset_traffic_success": "Traffic reset successfully",
        "delete": {
          "title": "Confirm Delete",
          "description": "This action will permanently delete this node and cannot be undone. Are you sure you want to continue?",
          "confirm": "Delete"
        },
        "copy_success": "Copied successfully",
        "delete_success": "Deleted successfully"
      }
    },
    "toolbar": {
      "search": "Search nodes...",
      "type": "Type",
      "status": "Status",
      "server": "Server",
      "server_search": "Search servers...",
      "server_empty": "No servers found",
      "reset": "Reset",
      "actions": "Actions",
      "sort": {
        "tip": "Drag nodes to sort, then click save",
        "edit": "Edit Sort",
        "save": "Save Sort",
        "success": "Sort order saved"
      },
      "batch_delete": {
        "menu": "Delete nodes",
        "button": "Delete {{count}} items",
        "title": "Confirm Batch Delete",
        "description": "Are you sure you want to delete the selected {{count}} nodes? This action cannot be undone.",
        "confirm": "Confirm Delete"
      },
      "batch_delete_success": "Successfully deleted {{count}} nodes",
      "batch_delete_error": "Batch delete failed",
      "batch_show": {
        "menu": "Show Nodes"
      },
      "batch_show_success": "Successfully shown {{count}} nodes",
      "batch_show_error": "Batch show failed",
      "batch_hide": {
        "menu": "Hide Nodes"
      },
      "batch_hide_success": "Successfully hidden {{count}} nodes",
      "batch_hide_error": "Batch hide failed",
      "batch_enable": {
        "menu": "Enable Nodes"
      },
      "batch_enable_success": "Successfully enabled {{count}} nodes",
      "batch_enable_error": "Batch enable failed",
      "batch_disable": {
        "menu": "Disable Nodes"
      },
      "batch_disable_success": "Successfully disabled {{count}} nodes",
      "batch_disable_error": "Batch disable failed",
      "batch_reset_traffic": {
        "menu": "Reset traffic",
        "button": "Reset {{count}} traffic",
        "title": "Confirm Batch Reset Traffic",
        "description": "Are you sure you want to reset traffic for the selected {{count}} nodes? This will clear traffic and unban the nodes.",
        "confirm": "Confirm Reset"
      },
      "batch_reset_traffic_success": "Successfully reset traffic for {{count}} nodes",
      "batch_reset_traffic_error": "Batch reset traffic failed",
      "batch_replace": {
        "selected": "{{count}} nodes selected",
        "menu": "Batch Replace",
        "clear": "Clear selection",
        "title": "Batch Replace Node Field",
        "field": "Field",
        "search": "Search Value",
        "search_placeholder": "Enter the string to search for",
        "replace": "Replace Value",
        "replace_placeholder": "Enter the string to replace with",
        "confirm": "Replace",
        "search_required": "Please enter a search value",
        "success": "Successfully replaced {{count}} nodes",
        "fields": {
          "name": "Node Name",
          "host": "Host",
          "port": "Port",
          "code": "Node Code",
          "group_ids": "Groups",
          "route_ids": "Routes",
          "tags": "Tags",
          "protocol_settings": "Protocol Settings",
          "custom_outbounds": "Custom Outbounds",
          "custom_routes": "Custom Routes",
          "cert_config": "Cert Config",
          "rate_time_ranges": "Rate Time Ranges"
        }
      },
      "filteringByMachine": "Filtering nodes of this machine:",
      "virtualNode": "Virtual Node"
    },
    "form": {
      "add_node": "Add Node",
      "edit_node": "Edit Node",
      "new_node": "New Node",
      "type": {
        "placeholder": "Select Protocol Type",
        "select_prompt": "Please select a protocol type first",
        "select_error": "Please select a protocol type",
        "configHint": "Can be configured after selecting a protocol type"
      },
      "name": {
        "label": "Node Name",
        "placeholder": "Please enter node name",
        "error": "Please enter a valid name"
      },
      "rate": {
        "label": "Base Rate",
        "hint": "Traffic billing multiplier; 1 means actual traffic",
        "error": "Base rate is required",
        "error_numeric": "Base rate must be a number",
        "error_gte_zero": "Base rate must be greater than or equal to 0",
        "child_node_tooltip": "Child node's base rate is inherited from parent node and cannot be set separately",
        "child_node_note": "Child node rate inherited from parent"
      },
      "traffic_limit": {
        "label": "Traffic Limit",
        "placeholder": "0 means no limit",
        "hint": "Set node traffic limit (unit: GB), 0 means no limit",
        "error_numeric": "Traffic limit must be a number",
        "error_gte_zero": "Traffic limit must be greater than or equal to 0"
      },      "protocolSection": "Protocol Settings",
      "traffic_limit_unit": "GB, 0=unlimited",

      "banned": {
        "label": "Disable Node",
        "description": "Node will be unavailable when disabled"
      },
      "dynamic_rate": {
        "section_title": "Dynamic Rate Configuration",
        "enable_label": "Enable Dynamic Rate",
        "enable_description": "Set different rate multipliers based on time periods",
        "rules_label": "Time Period Rules",
        "add_rule": "Add Rule",
        "rule_title": "Rule {{index}}",
        "start_time": "Start Time",
        "end_time": "End Time",
        "multiplier": "Rate Multiplier",
        "no_rules": "No rules yet, click the button above to add",
        "start_time_error": "Start time is required",
        "end_time_error": "End time is required",
        "multiplier_error": "Rate multiplier is required",
        "multiplier_error_numeric": "Rate multiplier must be a number",
        "multiplier_error_gte_zero": "Rate multiplier must be greater than or equal to 0"
      },
      "required_mark": "Required",
      "optional_mark": "Optional",
      "required_fields_hint": "Fields marked with * are required",
      "code": {
        "label": "Custom Node ID",
        "optional": "(Optional)",
        "placeholder": "Please enter custom node ID",
        "hint": "Optional; for external reference only"
      },
      "tags": {
        "label": "Node Tags",
        "optional": "(Optional)",
        "placeholder": "Press Enter to add tags",
        "hint": "Optional; shown next to the node name for users"
      },
      "groups": {
        "label": "Permission Groups",
        "add": "Add Group",
        "placeholder": "Please select permission groups",
        "empty": "No results found",
        "hint": "Optional; assign which user groups can see this node"
      },
      "routes": {
        "label": "Route Rules",
        "empty": "No route rules found",
        "hint": "Optional; bound route rules are delivered to client subscription configs using this node"
      },
      "machine": {
        "label": "Bind to Machine",
        "placeholder": "Select a machine (optional)",
        "none": "Standalone",
        "enabled_hint": "Whether this machine manages the node",
        "hint": "Optional; when set, Fboard-Node on that machine hosts this node"
      },
      "host": {
        "label": "Node Address",
        "placeholder": "Please enter domain or IP",
        "error": "Node address is required"
      },
      "port": {
        "label": "Connection Port",
        "placeholder": "443 or 10000-11000",
        "tooltip": "Client connection port. Supports a single port (e.g. 443) or a range (e.g. 10000-11000). For Hysteria2, a range makes the node listen on every port in that range for UDP port hopping (max span 1024); for other protocols the range is only used to pick a random port in the subscription. If using a relay/tunnel, this may differ from the server listen port.",
        "sync": "Sync to server port",
        "error": "Connection port is required"
      },
      "server_port": {
        "label": "Server Port",
        "placeholder": "Enter server port",
        "error": "Server port is required",
        "tooltip": "The actual listening port on the server. For Hysteria2 with a connection-port range, the node multi-listens on that range; this field is the fallback single port.",
        "sync": "Sync to server port"
      },
      "parent": {
        "label": "Parent Node",
        "placeholder": "Select parent node",
        "none": "None",
        "hint": "Optional; child nodes inherit protocol settings and online status"
      },
      "virtualNode": {
        "label": "Virtual Nodes",
        "add": "Add Virtual Node",
        "addDialogTitle": "Add Virtual Node",
        "editDialogTitle": "Edit Virtual Node",
        "edit": "Edit",
        "delete": "Delete",
        "save": "Save Virtual Nodes",
        "saveSuccess": "Virtual node saved",
        "saveFailed": "Failed to save virtual node",
        "description": "Virtual nodes are additional access points for the same service, independent from child/parent relationship",
        "empty": "No virtual nodes",
        "tagsPlaceholder": "Press Enter to add",
        "host": "Host",
        "hostPlaceholder": "host / domain",
        "port": "Port",
        "groupIds": "Permission Groups",
        "groupIdsHint": "Only groups already assigned to the parent node; extra groups cannot connect",
        "groupIdsParentEmpty": "Assign permission groups on the parent node first",
        "tags": "Tags",
        "show": "Visible",
        "visible": "Visible",
        "hidden": "Hidden",
        "namePlaceholder": "Virtual node name",
        "deleteConfirmTitle": "Confirm delete",
        "deleteConfirmDesc": "Delete virtual node \"{{name}}\"? This cannot be undone.",
        "deleteSuccess": "Virtual node deleted",
        "deleteFailed": "Failed to delete",
        "toggleFailed": "Failed to update visibility",
        "generateKeyPair": "Generate Key Pair"
      },
      "route": {
        "label": "Route Groups",
        "placeholder": "Select route groups",
        "empty": "No results found"
      },
      "submit": "Submit",
      "cancel": "Cancel",
      "success": "Submitted successfully",
      "listen_address": {
        "description": "Specify the IP address the server listens on. Leave empty for default (0.0.0.0) to listen on all interfaces. Can be set to 127.0.0.1 (local only) or a specific IP.",
        "hide": "Hide listen address",
        "label": "Listen Address",
        "optional": "Optional",
        "placeholder": "Leave empty for default (0.0.0.0), or enter e.g. 127.0.0.1, ::1",
        "show": "Listen Address"
      }
    },
    "networkTemplate": {
      "title": "Network Templates",
      "empty": "No templates available for this protocol",
      "description": "Pick a preset network template to fill protocol settings",
      "use": "Apply"
    ,
      "presets": {
        "vless-tcp-vision": {
          "label": "TCP + XTLS Vision",
          "description": "VLESS + TCP + XTLS Vision direct; very fast, recommended"
        },
        "vless-ws-tls": {
          "label": "WebSocket + TLS + CDN",
          "description": "VLESS + WebSocket + TLS; works with CDN (Cloudflare, etc.)"
        },
        "vless-grpc-tls": {
          "label": "gRPC + TLS",
          "description": "VLESS + gRPC + TLS; suitable for high load"
        },
        "vless-tcp-reality": {
          "label": "TCP + REALITY",
          "description": "VLESS + REALITY direct; no cert needed, resists active probing"
        },
        "trojan-tls": {
          "label": "Trojan + TLS",
          "description": "Standard Trojan + TLS on port 443"
        },
        "trojan-ws-tls": {
          "label": "Trojan + WebSocket + TLS",
          "description": "Trojan + WebSocket + TLS; works with CDN"
        },
        "ss-simple": {
          "label": "Standard AEAD",
          "description": "Shadowsocks encrypted tunnel; simple and efficient"
        },
        "hy-standard": {
          "label": "Hysteria Standard",
          "description": "Hysteria over QUIC; loss-resistant, good for weak networks"
        },
        "hy-brutal": {
          "label": "Hysteria2 Brute",
          "description": "Hysteria2 + Brute mode; maximizes bandwidth"
        },
        "tuic-v5": {
          "label": "TUIC v5 Standard",
          "description": "TUIC v5 over QUIC; low latency"
        },
        "anytls-default": {
          "label": "AnyTLS Default",
          "description": "AnyTLS with automated TLS camouflage"
        },
        "sudoku-default": {
          "label": "Sudoku Default",
          "description": "Low-entropy table + ChaCha20 + legacy HTTPMask"
        },
        "shadowquic-default": {
          "label": "ShadowQUIC Default",
          "description": "JLS camouflage + 0-RTT QUIC, Cloudflare upstream by default"
        }
      }},
    "dynamic_form": {
      "utls": {
        "fingerprint": {
          "random": "Random (at subscribe time)",
          "randomized": "Randomized (client-side)"
        }
      },
      "multiplex": {
        "enabled": {
          "label": "Multiplex",
          "description": "Transport multiple streams via a single TCP connection"
        },
        "protocol": {
          "label": "Protocol"
        },
        "max_connections": {
          "label": "Max Connections"
        },
        "min_streams": {
          "label": "Min Streams"
        },
        "padding": {
          "label": "Enable Padding"
        },
        "brutal": {
          "enabled": {
            "label": "TCP Brutal"
          },
          "up_mbps": {
            "label": "Upload Bandwidth"
          },
          "down_mbps": {
            "label": "Download Bandwidth"
          },
          "description": "TCP Brutal is a bilateral acceleration algorithm. Set bandwidth to 80%-90% of actual capacity. BBR will be disabled when enabled."
        }
      },
      "ech": {
        "description": "Encrypted Client Hello for supported TLS clients. Leave config empty to query DNS automatically.",
        "generate": "Auto-generate ECH Key Pair",
        "generateSuccess": "ECH key pair generated",
        "generateFailed": "Failed to generate ECH keys",
        "config": {
          "label": "ECH Config (PEM)",
          "placeholder": "Paste the ECH configuration in PEM format, one line per row",
          "description": "If empty, sing-box will attempt to load ECH configuration from DNS."
        },
        "config_path": {
          "label": "ECH Config Path",
          "placeholder": "/etc/sing-box/ech.pem",
          "description": "Path to an ECH configuration file in PEM format."
        },
        "query_server_name": {
          "label": "ECH Query Server Name",
          "placeholder": "Optional override for HTTPS record lookup",
          "description": "Overrides the domain used for ECH HTTPS record queries. Defaults to server_name."
        },
        "key": {
          "label": "ECH Key",
          "placeholder": "Paste ECH key content when backend requires it",
          "description": "Optional ECH key payload used by the backend."
        },
        "key_path": {
          "label": "ECH Key Path",
          "placeholder": "/etc/sing-box/ech.key",
          "description": "Path to the ECH key file when the backend requires it."
        }
      },
      "anytls": {
        "tls": {
          "server_name": {
            "label": "Server Name Indication (SNI)",
            "placeholder": "Used for certificate verification when domain differs from node address"
          },
          "allow_insecure": "Allow Insecure"
        },
        "padding_scheme": {
          "description": "Each line represents a padding rule, format: stop=8, 0=30-30",
          "label": "Padding Scheme",
          "placeholder": "Enter padding rules",
          "use_default": "Use Default Scheme",
          "edit_btn": "Edit Padding Scheme",
          "configured": "{{count}} rules configured",
          "not_configured": "Not configured"
        }
      },
      "shadowsocks": {
        "cipher": {
          "label": "Encryption Method",
          "placeholder": "Select encryption method",
          "search_placeholder": "Search or enter custom encryption method...",
          "description": "Select preset encryption method or enter custom encryption method",
          "preset_group": "Preset Encryption Methods",
          "custom_group": "Custom Encryption Method",
          "current_value": "Current Value",
          "use_custom": "Use",
          "no_results": "No matching encryption method found",
          "custom_hint": "You can directly enter a custom encryption method, such as: aes-256-cfb",
          "custom_label": "Custom"
        },
        "plugin": {
          "label": "Plugin",
          "placeholder": "Select plugin",
          "obfs_hint": "Hint: Configuration format like obfs=http;obfs-host=www.bing.com;path=/",
          "v2ray_hint": "Hint: WebSocket mode format is mode=websocket;host=mydomain.me;path=/;tls=true, QUIC mode format is mode=quic;host=mydomain.me",
          "gost_hint": "Hint: Configuration format like mode=websocket;host=mydomain.me;path=/;tls=true",
          "shadow_tls_hint": "Hint: Configuration format like host=cloud.tencent.com;password=auth_password;version=3",
          "restls_hint": "Hint: Configuration format like host=www.microsoft.com;password=auth_password;version-hint=tls13;restls-script=300?100<1,400~100",
          "kcptun_hint": "Hint: Configuration format like key=psk;crypt=aes-128-gcm;mode=fast;mtu=1350"
        },
        "plugin_opts": {
          "label": "Plugin Options",
          "description": "Enter plugin options in key=value;key2=value2 format",
          "placeholder": "Example: mode=tls;host=bing.com"
        },
        "client_fingerprint": "Client Fingerprint",
        "client_fingerprint_placeholder": "Select client fingerprint",
        "client_fingerprint_description": "Client spoofing fingerprint to reduce detection risk",
        "obfs": {
          "label": "Obfuscation",
          "placeholder": "Select obfuscation method",
          "none": "None",
          "http": "HTTP"
        },
        "obfs_settings": {
          "path": "Path",
          "host": "Host"
        },
        "cert_config": {
          "tab": "TLS Cert",
          "cert_mode": {
            "label": "Cert Mode",
            "description": "Select how to manage certificates",
            "self_description": "Self-signed: Valid for 10 years, auto-generated by node",
            "http_description": "HTTP-01: Port 80 must be reachable",
            "dns_description": "DNS-01: Authenticate via DNS records, supports wildcard certs",
            "content_description": "Content: Push raw cert files to node"
          },
          "domain": {
            "label": "Domain",
            "placeholder": "example.com"
          },
          "email": {
            "label": "Notification Email",
            "placeholder": "admin@example.com"
          },
          "http_port": {
            "label": "Challenge Port",
            "description": "ACME challenge port (default 80)"
          },
          "dns_provider": {
            "label": "DNS Provider",
            "doc_link": "DNS provider configuration guide"
          },
          "dns_env": {
            "label": "Env Vars (API Keys)",
            "description_short": "One KEY=VALUE per line"
          },
          "cert_content": {
            "label": "Certificate content (PEM)",
            "placeholder": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
            "description": "Paste full certificate PEM body, not a file path"
          },
          "key_content": {
            "label": "Private key content (PEM)",
            "placeholder": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
            "description": "Paste full private key PEM body, not a file path"
          },
          "templates": {
            "title": "Cert Templates",
            "save_current": "Save current as template",
            "save": "Save template",
            "saved": "Cert template saved",
            "save_failed": "Failed to save cert template",
            "deleted": "Cert template deleted",
            "delete_failed": "Failed to delete cert template",
            "delete": "Delete template",
            "use": "Apply",
            "applied": "Applied cert template: {{name}}",
            "name_required": "Please enter a template name",
            "name_placeholder": "Template name, e.g. production cert",
            "description_placeholder": "Template description (optional)",
            "search_placeholder": "Search templates by name or description…",
            "empty_content": "Fill in certificate and private key content first, then save as template",
            "empty": "No cert templates yet"
          },
          "none_desc": "TLS config disabled"
        }
      },
      "vmess": {
        "tls": {
          "label": "TLS",
          "placeholder": "Please select security",
          "disabled": "Disabled",
          "enabled": "Enabled"
        },
        "tls_settings": {
          "server_name": {
            "label": "Server Name Indication (SNI)",
            "placeholder": "Leave empty if not used"
          },
          "allow_insecure": "Allow Insecure?"
        },
        "network": {
          "label": "Transport Protocol",
          "placeholder": "Select transport protocol"
        }
      },
      "trojan": {
        "server_name": {
          "label": "Server Name Indication (SNI)",
          "placeholder": "Used for certificate verification when node address differs from certificate"
        },
        "allow_insecure": "Allow Insecure?",
        "reality_settings": {
          "server_name": {
            "label": "Destination Site (dest)",
            "placeholder": "e.g., example.com"
          },
          "server_port": {
            "label": "Port",
            "placeholder": "e.g., 443"
          },
          "allow_insecure": "Allow Insecure?",
          "private_key": {
            "label": "Private Key"
          },
          "public_key": {
            "label": "Public Key"
          },
          "short_id": {
            "label": "Short ID",
            "placeholder": "Optional, length must be even, max 16 characters",
            "description": "List of shortIds available to clients, can be used to distinguish different clients, using hexadecimal characters 0-f",
            "generate": "Generate Short ID",
            "success": "Short ID generated successfully"
          },
          "key_pair": {
            "generate": "Generate Key Pair",
            "success": "Key pair generated successfully",
            "error": "Failed to generate key pair"
          }
        },
        "network": {
          "label": "Transport Protocol",
          "placeholder": "Select transport protocol"
        }
      },
      "hysteria": {
        "version": {
          "label": "Protocol Version",
          "placeholder": "Protocol version"
        },
        "alpn": {
          "label": "ALPN",
          "placeholder": "ALPN"
        },
        "obfs": {
          "label": "Obfuscation",
          "type": {
            "label": "Obfuscation Implementation",
            "placeholder": "Select obfuscation implementation",
            "salamander": "Salamander"
          },
          "password": {
            "label": "Obfuscation Password",
            "placeholder": "Please enter obfuscation password",
            "generate_success": "Obfuscation password generated successfully"
          }
        },
        "tls": {
          "server_name": {
            "label": "Server Name Indication (SNI)",
            "placeholder": "Used for certificate verification when node address differs from certificate"
          },
          "allow_insecure": "Allow Insecure?"
        },
        "bandwidth": {
          "up": {
            "label": "Upload Bandwidth",
            "placeholder": "Please enter upload bandwidth",
            "suffix": "Mbps",
            "bbr_tip": ", leave empty to use BBR"
          },
          "down": {
            "label": "Download Bandwidth",
            "placeholder": "Please enter download bandwidth",
            "suffix": "Mbps",
            "bbr_tip": ", leave empty to use BBR"
          }
        }
      },
      "vless": {
        "tls": {
          "label": "Security",
          "placeholder": "Please select security",
          "none": "None",
          "tls": "TLS",
          "reality": "Reality"
        },
        "tls_settings": {
          "server_name": {
            "label": "Server Name Indication (SNI)",
            "placeholder": "Leave empty if not used"
          },
          "allow_insecure": "Allow Insecure?"
        },
        "reality_settings": {
          "server_name": {
            "label": "Destination Site (dest)",
            "placeholder": "e.g., example.com"
          },
          "server_port": {
            "label": "Port",
            "placeholder": "e.g., 443"
          },
          "allow_insecure": "Allow Insecure?",
          "private_key": {
            "label": "Private Key"
          },
          "public_key": {
            "label": "Public Key"
          },
          "short_id": {
            "label": "Short ID",
            "placeholder": "Optional, length must be even, max 16 characters",
            "description": "List of shortIds available to clients, can be used to distinguish different clients, using hexadecimal characters 0-f",
            "generate": "Generate Short ID",
            "success": "Short ID generated successfully"
          },
          "key_pair": {
            "generate": "Generate Key Pair",
            "success": "Key pair generated successfully",
            "error": "Failed to generate key pair"
          }
        },
        "network": {
          "label": "Transport Protocol",
          "placeholder": "Select transport protocol"
        },
        "flow": {
          "label": "Flow Control",
          "placeholder": "Select flow control"
        },
        "encryption": {
          "label": "VLESS Encryption",
          "description": "Enable VLESS encryption",
          "server_label": "decryption",
          "server_placeholder": "./xray vlessenc",
          "server_description": "Server-side decryption value; generate with ./xray vlessenc",
          "client_label": "encryption",
          "client_placeholder": "./xray vlessenc",
          "client_description": "Client-side encryption value; must pair with the server",
          "generate_hint": "./xray vlessenc"
        }
      },
      "tuic": {
        "version": {
          "label": "Protocol Version",
          "placeholder": "Select TUIC Version"
        },
        "password": {
          "label": "Password",
          "placeholder": "Enter Password",
          "generate_success": "Password Generated Successfully"
        },
        "congestion_control": {
          "label": "Congestion Control",
          "placeholder": "Select Congestion Control Algorithm"
        },
        "udp_relay_mode": {
          "label": "UDP Relay Mode",
          "placeholder": "Select UDP Relay Mode"
        },
        "tls": {
          "server_name": {
            "label": "Server Name Indication (SNI)",
            "placeholder": "Used for certificate verification when domain differs from node address"
          },
          "allow_insecure": "Allow Insecure?",
          "alpn": {
            "label": "ALPN",
            "placeholder": "Select ALPN Protocols",
            "empty": "No ALPN Protocols Available"
          }
        }
      },
      "socks": {
        "version": {
          "label": "Protocol Version",
          "placeholder": "Select SOCKS Version"
        },
        "tls": {
          "label": "TLS",
          "placeholder": "Please select security",
          "disabled": "Disabled",
          "enabled": "Enabled"
        },
        "tls_settings": {
          "server_name": {
            "label": "Server Name Indication (SNI)",
            "placeholder": "Leave empty if not used"
          },
          "allow_insecure": "Allow Insecure?"
        },
        "network": {
          "label": "Transport Protocol",
          "placeholder": "Select transport protocol"
        }
      },
      "sudoku": {
        "name": "Sudoku",
        "keyPairTitle": "Sudoku Key Pair",
        "keyPairDescription": "The server uses the Master Public Key; the Master Private Key stays on the panel to derive user keys and is never sent to nodes",
        "generate": "Generate",
        "generateSuccess": "Sudoku key pair generated",
        "generateFailed": "Failed to generate Sudoku keys",
        "publicPlaceholder": "Click Generate above to fill automatically",
        "privatePlaceholder": "Panel only — do not leak",
        "master_public_key": "Master Public Key",
        "master_private_key": "Master Private Key",
        "aead_method": "AEAD",
        "padding_min": "Padding Min",
        "padding_max": "Padding Max",
        "table_type": "Table Type",
        "enable_pure_downlink": "Pure Downlink",
        "custom_table": "Custom Table",
        "custom_tables": "Custom Tables",
        "handshake_timeout": "Handshake Timeout",
        "fallback": "Fallback",
        "multiplex": "Multiplex",
        "httpmask": "HTTPMask"
      },
      "naive": {
        "tls_settings": {
          "server_name": {
            "label": "Server Name Indication (SNI)",
            "placeholder": "Used for certificate verification when domain differs from node address"
          },
          "allow_insecure": "Allow Insecure"
        },
        "tls": {
          "label": "TLS",
          "placeholder": "Please select security",
          "disabled": "Disabled",
          "enabled": "Enabled",
          "server_name": {
            "label": "Server Name Indication (SNI)",
            "placeholder": "Used for certificate verification when domain differs from node address"
          },
          "allow_insecure": "Allow Insecure"
        }
      },
      "http": {
        "tls_settings": {
          "server_name": {
            "label": "Server Name Indication (SNI)",
            "placeholder": "Used for certificate verification when domain differs from node address"
          },
          "allow_insecure": "Allow Insecure"
        },
        "tls": {
          "label": "TLS",
          "placeholder": "Please select security",
          "disabled": "Disabled",
          "enabled": "Enabled",
          "server_name": {
            "label": "Server Name Indication (SNI)",
            "placeholder": "Used for certificate verification when domain differs from node address"
          },
          "allow_insecure": "Allow Insecure"
        }
      },
      "mieru": {
        "transport": {
          "label": "Transport Protocol",
          "placeholder": "Select transport protocol"
        },
        "traffic_pattern": {
          "label": "Traffic fingerprint camouflage (Base64)",
          "placeholder": "Leave empty for default, or click the button to generate",
          "description": "Optional. Official mieru Traffic Pattern (Base64) for anti-DPI shaping such as TCP fragmentation / nonce prefix. Export via mita/mieru export traffic-pattern.",
          "generate": "Generate traffic fingerprint camouflage",
          "success": "Traffic fingerprint camouflage generated"
        }
      },
      "cert_config": {
        "tab": "TLS Cert",
        "none_desc": "TLS config disabled",
        "cert_mode": {
          "label": "Cert Mode",
          "description": "Select how to manage certificates",
          "none_desc": "TLS config disabled"
        },
        "domain": {
          "label": "Domain"
        },
        "email": {
          "label": "Notification Email"
        },
        "http_port": {
          "label": "Challenge Port",
          "description": "ACME challenge port (default 80)"
        },
        "dns_provider": {
          "label": "DNS Provider",
          "doc_link": "DNS provider configuration guide"
        },
        "dns_env": {
          "label": "Env Vars (API Keys)",
          "description_short": "One KEY=VALUE per line"
        },
        "cert_content": {
          "label": "Certificate content (PEM)",
          "placeholder": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
          "description": "Paste full certificate PEM body, not a file path"
        },
        "key_content": {
          "label": "Private key content (PEM)",
          "placeholder": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
          "description": "Paste full private key PEM body, not a file path"
        },
        "templates": {
          "title": "Cert Templates",
          "save_current": "Save current as template",
          "save": "Save template",
          "saved": "Cert template saved",
          "save_failed": "Failed to save cert template",
          "deleted": "Cert template deleted",
          "delete_failed": "Failed to delete cert template",
          "delete": "Delete template",
          "use": "Apply",
          "applied": "Applied cert template: {{name}}",
          "name_required": "Please enter a template name",
          "name_placeholder": "Template name, e.g. production cert",
          "description_placeholder": "Template description (optional)",
          "search_placeholder": "Search templates by name or description…",
          "empty_content": "Fill in certificate and private key content first, then save as template",
          "empty": "No cert templates yet"
        }
      },
      "routing": {
        "outbounds_tab": "Custom Outbounds",
        "routes_tab": "Custom Routes",
        "outbounds": "Custom Outbounds (JSON)",
        "routes": "Custom Routes (JSON)",
        "error": {
          "must_be_array": "Must be a JSON array []",
          "invalid_json": "Invalid JSON format"
        }
      },
      "advanced": {
        "trigger_label": "Advanced Config",
        "dialog_title": "Advanced Protocol Configuration",
        "tls_tab": "TLS",
        "route_tab": "Routing",
        "multiplex_tab": "Multiplex"
      }
    },
    "network_settings": {
      "edit_protocol": "Edit Protocol",
      "edit_protocol_config": "Edit Network Settings",
      "use_template": "Use {{template}} Template",
      "json_label": "Network Settings (JSON)",
      "json_config_placeholder": "Enter network settings as JSON",
      "json_config_placeholder_with_template": "Enter JSON config, e.g. path / host / serviceName",
      "templates": "Templates",
      "templates_empty": "No templates yet. Save the current config as a template.",
      "templates_custom": "My Templates",
      "templates_builtin": "Built-in Templates",
      "builtin": "Built-in",
      "save_as_template": "Save current as template",
      "save_template": "Save template",
      "delete_template": "Delete template",
      "use_template_btn": "Use",
      "template_name_placeholder": "Template name, e.g. Custom WS path",
      "template_name_required": "Please enter a template name",
      "template_empty": "Current config is empty and cannot be saved",
      "template_from_current": "From current {{network}} config",
      "template_custom_desc": "Custom network settings template",
      "template_saved": "Template saved",
      "template_save_failed": "Failed to save template",
      "template_deleted": "Template deleted",
      "template_delete_failed": "Failed to delete template",
      "template_applied": "Applied template: {{name}}",
      "validation": {
        "must_be_object": "Configuration must be a JSON object",
        "invalid_json": "Invalid JSON format",
        "must_be_array": "Config must be a JSON array"
      },
      "errors": {
        "save_failed": "Error occurred while saving"
      },
      "edit_padding_scheme": "Edit Padding Scheme"
    ,
      "builtin_templates": {
        "ws-basic": {
          "name": "WebSocket Basic",
          "description": "path + Host"
        },
        "ws-cdn": {
          "name": "WebSocket + CDN",
          "description": "Suitable for Cloudflare and other CDNs"
        },
        "grpc-basic": {
          "name": "gRPC Basic",
          "description": "serviceName"
        },
        "grpc-multi": {
          "name": "gRPC multiMode",
          "description": "Enable multiMode"
        },
        "http-basic": {
          "name": "HTTP/2 Basic",
          "description": "path + host"
        },
        "tcp-none": {
          "name": "TCP No Obfuscation",
          "description": "Plain TCP"
        },
        "tcp-http": {
          "name": "TCP HTTP Obfuscation",
          "description": "header type = http"
        },
        "xhttp-basic": {
          "name": "XHTTP Basic",
          "description": "path mode"
        },
        "quic-basic": {
          "name": "QUIC Basic",
          "description": "security + key"
        },
        "kcp-basic": {
          "name": "KCP Basic",
          "description": "default mtu / tti"
        }
      }},
    "common": {
      "cancel": "Cancel",
      "confirm": "Confirm"
    },
    "messages": {
      "saveFailed": "Save failed"
    }
  },
  "coupon": {
    "title": "Coupon Management",
    "description": "Here you can manage coupons, including adding, viewing, and deleting operations.",
    "table": {
      "columns": {
        "id": "ID",
        "select": "Select",
        "show": "Enable",
        "name": "Coupon Name",
        "type": "Type",
        "code": "Code",
        "limitUse": "Remaining Uses",
        "limitUseWithUser": "Uses Per User",
        "validity": "Validity Period",
        "actions": "Actions"
      },
      "validity": {
        "expired": "Expired {{days}} days ago",
        "notStarted": "Starts in {{days}} days",
        "remaining": "{{days}} days remaining",
        "startTime": "Start Time",
        "endTime": "End Time",
        "unlimited": "Unlimited",
        "noLimit": "No Limit"
      },
      "actions": {
        "edit": "Edit",
        "delete": "Delete",
        "deleteConfirm": {
          "title": "Confirm Delete",
          "description": "This action will permanently delete this coupon and cannot be undone. Are you sure you want to continue?",
          "confirmText": "Delete"
        },
        "batchDelete": "Delete Selected ({{count}})",
        "batchDeleteConfirm": {
          "title": "Batch Delete",
          "description": "Are you sure you want to delete the selected {{count}} coupons? This action cannot be undone."
        },
        "dropExpired": "Delete Expired",
        "dropExpiredConfirm": {
          "title": "Delete Expired Coupons",
          "description": "Are you sure you want to delete all expired coupons? This action cannot be undone."
        },
        "dropExpiredResult": {
          "success": "Successfully deleted {{count}} expired coupon(s)",
          "empty": "No expired coupons found"
        }
      },
      "toolbar": {
        "search": "Search coupons...",
        "type": "Type",
        "reset": "Reset",
        "types": {
          "1": "Fixed Amount",
          "2": "Percentage"
        }
      }
    },
    "form": {
      "add": "Add Coupon",
      "edit": "Edit Coupon",
      "name": {
        "label": "Coupon Name",
        "placeholder": "Enter coupon name",
        "required": "Please enter coupon name"
      },
      "type": {
        "label": "Coupon Type and Value",
        "placeholder": "Select coupon type"
      },
      "value": {
        "placeholder": "Enter value (yuan)"
      },
      "validity": {
        "label": "Validity Period",
        "to": "to",
        "endTimeError": "End time must be later than start time"
      },
      "limitUse": {
        "label": "Maximum Uses",
        "placeholder": "Set maximum uses, leave empty for unlimited",
        "description": "Set the total number of times this coupon can be used, leave empty for unlimited uses"
      },
      "limitUseWithUser": {
        "label": "Uses Per User",
        "placeholder": "Set uses per user, leave empty for unlimited",
        "description": "Limit how many times each user can use this coupon, leave empty for unlimited uses per user"
      },
      "limitPeriod": {
        "label": "Subscription Periods",
        "placeholder": "Limit to specific subscription periods, leave empty for no restrictions",
        "description": "Select which subscription periods can use this coupon, leave empty for no period restrictions",
        "empty": "No matching periods found"
      },
      "limitPlan": {
        "label": "Subscription Plans",
        "placeholder": "Limit to specific subscription plans, leave empty for no restrictions",
        "description": "Select which subscription plans can use this coupon, leave empty for no plan restrictions",
        "empty": "No matching plans found"
      },
      "code": {
        "label": "Custom Coupon Code",
        "placeholder": "Enter custom code, leave empty for auto-generation",
        "description": "Customize the coupon code, leave empty for auto-generation"
      },
      "generateCount": {
        "label": "Batch Generation Count",
        "placeholder": "Number of coupons to generate, leave empty for single coupon",
        "description": "Generate multiple coupon codes at once, leave empty to generate a single code"
      },
      "submit": {
        "saving": "Saving...",
        "save": "Save"
      },
      "error": {
        "saveFailed": "Failed to save coupon"
      },
      "timeRange": {
        "quickSet": "Quick Set",
        "presets": {
          "1week": "1 Week",
          "2weeks": "2 Weeks",
          "1month": "1 Month",
          "3months": "3 Months",
          "6months": "6 Months",
          "1year": "1 Year"
        }
      }
    },
    "period": {
      "hourly": "Hourly",
      "daily": "Daily",
      "monthly": "Monthly",
      "quarterly": "Quarterly",
      "half_yearly": "Half Yearly",
      "yearly": "Yearly",
      "two_yearly": "Two Yearly",
      "three_yearly": "Three Yearly",
      "onetime": "One Time",
      "reset_traffic": "Reset Traffic"
    }
  },
  "route": {
    "title": "Route Management",
    "description": "Manage all route groups, including adding, deleting, and editing operations.",
    "columns": {
      "id": "Group ID",
      "remarks": "Remarks",
      "action": "Action",
      "actions": "Actions",
      "matchRules": "Match {{count}} rules",
      "action_value": {
        "title": "Action Value",
        "dns": "DNS: {{value}}",
        "proxy": "Proxy ({{value}})",
        "block": "Block Access",
        "direct": "Direct Connection"
      }
    },
    "actions": {
      "dns": "Resolve using specified DNS server",
      "block": "Block access",
      "direct": "Direct connection",
      "proxy": "Proxy",
      "short": {
        "dns": "DNS",
        "block": "Block",
        "direct": "Direct",
        "proxy": "Proxy"
      }
    },
    "form": {
      "add": "Add Route",
      "edit": "Edit Route",
      "create": "Create Route",
      "remarks": "Remarks",
      "remarksPlaceholder": "Please enter remarks",
      "match": "Match Rules",
      "matchPlaceholder": "example.com\n*.example.com",
      "action": "Action",
      "actionPlaceholder": "Please select action",
      "dns": "DNS Server",
      "dnsPlaceholder": "Please enter DNS server",
      "proxy": "Outbound Tag",
      "proxyPlaceholder": "Please enter outbound tag",
      "cancel": "Cancel",
      "submit": "Submit",
      "validation": {
        "remarks": "Please enter valid remarks"
      }
    },
    "toolbar": {
      "searchPlaceholder": "Search routes...",
      "reset": "Reset"
    },
    "messages": {
      "deleteConfirm": "Confirm Delete",
      "deleteDescription": "This action will permanently delete this route group and cannot be recovered. Are you sure you want to continue?",
      "deleteButton": "Delete",
      "deleteSuccess": "Deleted Successfully",
      "createSuccess": "Created Successfully",
      "updateSuccess": "Updated Successfully"
    }
  },
  "ticket": {
    "title": "Ticket Management",
    "description": "View and manage user tickets, including viewing, replying, and closing operations.",
    "columns": {
      "id": "Ticket ID",
      "subject": "Subject",
      "level": "Priority",
      "status": "Status",
      "updated_at": "Last Updated",
      "created_at": "Created At",
      "actions": "Actions"
    },
    "status": {
      "closed": "Closed",
      "replied": "Replied",
      "pending": "Pending",
      "processing": "Processing",
      "unreplied": "Unreplied"
    },
    "level": {
      "low": "Low Priority",
      "medium": "Medium Priority",
      "high": "High Priority"
    },
    "filter": {
      "placeholder": "Search {field}...",
      "no_results": "No results found",
      "selected": "{count} selected",
      "clear": "Clear filters"
    },
    "actions": {
      "reply_success": "Replied",
      "view_details": "View Details",
      "close_ticket": "Close Ticket",
      "close_confirm_title": "Confirm Close Ticket",
      "close_confirm_description": "Are you sure you want to close this ticket? It will move to the closed list, but you can still reply later.",
      "close_confirm_button": "Confirm Close",
      "close_success": "Ticket closed successfully",
      "view_ticket": "View Ticket"
    },
    "detail": {
      "no_messages": "No messages yet",
      "created_at": "Created at",
      "sender_admin": "Admin",
      "sender_user": "User",
      "user_info": "User Info",
      "traffic_records": "Traffic Records",
      "order_records": "Order Records",
      "input": {
        "closed_reply_placeholder": "This ticket is closed, but you can still reply...",
        "closed_hint": "This ticket is closed. You can keep replying and new messages will still be appended here.",
        "reply_placeholder": "Type your reply...",
        "sending": "Sending...",
        "send": "Send",
        "shortcut_hint": "Enter to send · Shift + Enter for a new line"
      }
    },
    "list": {
      "title": "Ticket List",
      "search_placeholder": "Search ticket subject or user email",
      "no_tickets": "No tickets",
      "no_open_tickets": "No open tickets",
      "no_closed_tickets": "No closed tickets",
      "no_search_results": "No matching tickets found",
      "collapse": "Collapse list",
      "expand": "Expand list"
    }
  },
    "withdrawal": {
    "title": "Withdrawal Management",
    "description": "Manage user commission withdrawal requests, support confirmation and rejection operations.",
    "columns": {
      "id": "ID",
      "user": "User",
      "method": "Method",
      "account": "Account",
      "amount": "Amount",
      "status": "Status",
      "created_at": "Created",
      "actions": "Actions"
    },
    "status": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "closed": "Closed"
    },
    "filter": {
      "all": "All"
    },
    "actions": {
      "view": "View Details",
      "confirm": "Confirm",
      "close": "Close",
      "user_info": "User Info",
      "confirm_title": "Confirm Withdrawal",
      "confirm_description": "Confirming will close this withdrawal request. Please ensure payment is processed.",
      "confirm_button": "Confirm",
      "confirm_success": "Withdrawal confirmed",
      "close_confirm_title": "Close Withdrawal",
      "close_confirm_description": "Closing will refund the commission to the user account.",
      "close_confirm_button": "Confirm Close",
      "close_success": "Withdrawal closed, commission refunded",
      "reply_success": "Reply sent",
      "confirm_desc": "Confirming will close this withdrawal request. Please ensure payment is processed.",
      "close_desc": "Closing will refund the commission to the user account. Continue?"
    },
    "list": {
      "search_placeholder": "Search withdrawal account...",
      "no_withdrawals": "No withdrawal records",
      "no_open_withdrawals": "No pending withdrawals",
      "title": "Withdrawal List",
      "collapse": "Collapse",
      "expand": "Expand"
    },
    "detail": {
      "created_at": "Created",
      "user_info": "User Info",
      "traffic_records": "Traffic",
      "order_records": "Orders",
      "no_messages": "No messages yet",
      "operator": "Operator",
      "remark": "Remark",
      "remark_placeholder": "Enter remark (optional)",
      "sender_user": "User",
      "sender_admin": "Admin",
      "input": {
        "closed_hint": "This withdrawal has been processed, no further replies allowed",
        "reply_placeholder": "Type a message...",
        "closed_reply_placeholder": "This withdrawal has been processed",
        "send": "Send",
        "sending": "Sending...",
        "shortcut_hint": "Enter to send, Shift+Enter for new line"
      }
    }
  },

  "machine": {
    "title": "Server Management",
    "description": "Review server health, load, and hosted nodes, then manage the Fboard-Node service from an operations view.",
    "columns": {
      "id": "ID",
      "name": "Server Name",
      "status": "Status",
      "nodes": "Nodes",
      "nodesHosted": "Nodes",
      "nodesIdle": "idle",
      "load": "Load",
      "lastSeen": "Last Seen",
      "version": "Version",
      "actions": "Actions",
      "online": "Online",
      "offline": "Offline",
      "inactive": "Disabled",
      "noData": "No load data",
      "cpu": "CPU",
      "memory": "Memory",
      "disk": "Disk",
      "never": "Never",
      "lastReport": "Load report",
      "kernel": "Kernel",
      "kernelRunning": "Running",
      "kernelStopped": "Stopped",
      "kernelPartial": "Partial",
      "kernelIdle": "No nodes",
      "kernelUnknown": "Unknown",
      "kernelDetail": "{{running}}/{{total}} running"
    },
    "toolbar": {
      "search": "Search by server name, notes or SID...",
      "status": "Status",
      "status_all": "All Status",
      "status_online": "Online",
      "status_offline": "Offline",
      "status_inactive": "Disabled",
      "status_high_load": "High Load",
      "nodes": "Nodes",
      "nodesHosted": "Nodes",
      "nodesIdle": "idle",
      "with_nodes": "Hosting nodes",
      "idle_nodes": "Idle servers",
      "high_load": "High load",
      "online_ratio": "Online",
      "high_load_count": "High load",
      "tip": "Use this page to quickly review server health, hosted node count, and resource pressure.",
      "reset": "Reset"
    },
    "operations": {
      "upgrade": "Upgrade Fboard-Node",
      "ops": "Kernel Ops",
      "start": "Start Kernel",
      "stop": "Stop Kernel",
      "reload": "Reload Kernel",
      "restart": "Restart Kernel",
      "upgradeTitle": "Confirm Server Upgrade",
      "upgradeDescription": "Fboard-Node on server “{{name}}” will be upgraded. The service may be briefly interrupted during the upgrade.",
      "startTitle": "Confirm Kernel Start",
      "startDescription": "Start the embedded xray kernel for every node on server “{{name}}”. The fboard-node process and WebSocket stay up.",
      "stopTitle": "Confirm Kernel Stop",
      "stopDescription": "Stop the embedded xray kernel for every node on server “{{name}}”. Proxy will be unavailable until started again. Process and WebSocket stay up.",
      "reloadTitle": "Confirm Kernel Reload",
      "reloadDescription": "Reload the embedded xray kernel config for every node on server “{{name}}”. Process and WebSocket stay up.",
      "restartTitle": "Confirm Kernel Restart",
      "restartDescription": "Force-rebuild the embedded xray kernel for every node on server “{{name}}”. Proxy will briefly interrupt; fboard-node process and WebSocket stay up.",
      "upgradeSubmitted": "Upgrade task submitted for server “{{name}}”",
      "startSubmitted": "Kernel start task submitted for server “{{name}}”",
      "stopSubmitted": "Kernel stop task submitted for server “{{name}}”",
      "reloadSubmitted": "Kernel reload task submitted for server “{{name}}”",
      "restartSubmitted": "Kernel restart task submitted for server “{{name}}”",
      "batchUpgrade": "Upgrade All Servers",
      "batchUpgradeTitle": "Confirm Batch Server Upgrade",
      "batchUpgradeDescription": "One Fboard-Node upgrade task will be submitted for each online and enabled server. This does not depend on how many nodes the server hosts.",
      "batchUpgradeSubmitted": "Submitted {{submitted}} servers; skipped {{inactive}} disabled and {{offline}} offline servers"
    },

    "overview": {
      "total": "Total Servers",
      "total_hint": "Hosting {{count}} nodes in total",
      "online": "Online Servers",
      "online_hint": "Heartbeat received in the last 5 minutes",
      "offline": "Offline / Lost",
      "offline_hint": "Heartbeat or agent should be checked",
      "high_load": "High Load",
      "high_load_hint": "CPU, memory or disk is near the threshold",
      "nodes_suffix": "nodes",
      "attention": "Attention",
      "stable": "Stable",
      "needs_review": "Review",
      "normal": "Normal"
    },
    "form": {
      "add": "Add Server",
      "create": "New Server",
      "edit": "Edit Server",
      "createDescription": "Create a server record when you want one host to manage multiple nodes.",
      "editDescription": "Modify server name, notes or status.",
      "name": "Server Name",
      "namePlaceholder": "e.g. HK-01",
      "nameError": "Server name is required",
      "notes": "Notes",
      "notesPlaceholder": "Optional notes about this server",
      "isActive": "Enable Server",
      "isActiveDescription": "Disabled servers will not be used by Fboard-Node.",
      "cancel": "Cancel",
      "submit": "Submit",
      "update": "Update"
    },
    "token": {
      "title": "Server Token",
      "description": "This token is used by Fboard-Node to authenticate with the panel. Keep it safe.",
      "show": "View Token",
      "hide": "Hide Token",
      "reset": "Reset Token",
      "resetConfirm": "Reset Token?",
      "resetDescription": "The old token will be invalidated immediately. Fboard-Node must be reconfigured with the new token.",
      "copy": "Copy",
      "copied": "Token copied to clipboard",
      "copiedInline": "Copied!",
      "copyFailed": "Copy failed, please copy manually",
      "autoHide": "Auto-hides in {{time}}",
      "resetSuccess": "Token has been reset",
      "createdHint": "Token generated. You can view it anytime in the server detail page."
    },
    "install": {
      "title": "Install Fboard-Node",
      "description": "Run this command on the target server to install Fboard-Node in machine mode and connect it to this server record.",
      "copy": "Copy install command",
      "copied": "Install command copied",
      "copiedInline": "Copied!",
      "copyFailed": "Copy failed",
      "loading": "Generating command...",
      "hint": "Requires root or sudo privileges and a Linux server with systemd."
    },
    "logs": {
      "title": "Runtime Logs",
      "description": "Recent logs from the Fboard-Node process memory ring (up to ~1000 lines).",
      "refresh": "Refresh",
      "copy": "Copy logs",
      "copied": "Logs copied",
      "loading": "Fetching logs...",
      "empty": "No logs yet",
      "offline": "Server is offline; live logs unavailable",
      "stale": "Showing cached logs (may be stale)",
      "timeout": "Timed out waiting for node logs",
      "updatedAt": "Updated {{time}}",
      "lineCount": "{{count}} lines",
      "autoScroll": "Auto-scroll to bottom",
      "fetchFailed": "Failed to fetch logs"
    },
    "detail": {
      "title": "Server Detail",
      "info": "Server Info",
      "associatedNodes": "Associated Nodes",
      "noNodes": "No nodes are hosted by this server.",
      "nodeId": "ID",
      "nodeName": "Name",
      "nodeType": "Type",
      "nodeHost": "Address",
      "nodePort": "Port",
      "nodeShow": "Visible",
      "nodeEnabled": "Enabled",
      "loadTrend": "Load Trend",
      "networkTrend": "Network Speed",
      "noHistory": "No historical load data yet.",
      "openNodeManage": "Open Node Management",
      "addNodeToServer": "Add Node To This Server",
      "nodeCount": "{{count}} nodes",
      "nodeEnabledCount": "{{count}} enabled",
      "toggleEnabledError": "Failed to toggle node status",
      "bindExistingButton": "Bind Existing",
      "bindExistingTitle": "Bind Existing Nodes",
      "bindExistingDescription": "Select nodes to bind to \"{{name}}\"",
      "bindSearchPlaceholder": "Search by name, address, type...",
      "bindTypeAll": "All types",
      "noUnboundNodes": "No unbound nodes available",
      "noSearchResults": "No matching nodes",
      "selectAll": "Select all ({{count}})",
      "selectedCount": "{{count}} selected",
      "bindConfirm": "Bind {{count}} nodes",
      "binding": "Binding...",
      "bindSuccess": "Successfully bound {{count}} nodes to \"{{name}}\"",
      "bindFailed": "Binding failed",
      "unbindNode": "Unbind",
      "unbindSuccess": "\"{{name}}\" has been unbound",
      "unbindFailed": "Unbind failed",
      "unbindConfirmTitle": "Confirm unbind",
      "unbindConfirmDescription": "The node \"{{name}}\" will be unbound from this server (the node itself will not be deleted).",
      "cancel": "Cancel"
    },
    "messages": {
      "createSuccess": "Server created successfully",
      "updateSuccess": "Server updated successfully",
      "deleteConfirm": "Delete Server?",
      "deleteDescription": "Associated nodes will be unbound (not deleted). This action cannot be undone.",
      "deleteButton": "Delete",
      "deleteSuccess": "Server deleted successfully",
      "deleteFailed": "Failed to delete server",
      "saveFailed": "Failed to save server",
      "tokenFetchFailed": "Failed to fetch token",
      "tokenResetFailed": "Failed to reset token"
    },
    "nodeForm": {
      "machineId": "Bind to Server",
      "machineIdPlaceholder": "Select a server (optional)",
      "machineIdNone": "Standalone deployment",
      "enabled": "Enabled on Server",
      "enabledDescription": "Whether the node is activated on the selected server"
    },
    "nodesStatus": {
      "toggleHint": "Change status in node management"
    }
  },
  "search": {
    "placeholder": "Search menus and functions...",
    "title": "Menu Navigation",
    "noResults": "No results found",
    "shortcut": {
      "label": "Search",
      "key": "⌘K"
    }
  },
  "knowledge": {
    "title": "Knowledge Base",
    "description": "Here you can configure the knowledge base, including adding, deleting, and editing operations.",
    "columns": {
      "id": "ID",
      "status": "Status",
      "title": "Title",
      "category": "Category",
      "actions": "Actions"
    },
    "form": {
      "add": "Add Knowledge",
      "edit": "Edit Knowledge",
      "title": "Title",
      "titlePlaceholder": "Please enter knowledge title",
      "category": "Category",
      "categoryPlaceholder": "Please enter category, it will be automatically classified",
      "language": "Language",
      "languagePlaceholder": "Please select language",
      "content": "Content",
      "show": "Show",
      "cancel": "Cancel",
      "submit": "Submit"
    },
    "languages": {
      "en-US": "English",
      "ja-JP": "日本語",
      "ko-KR": "한국어",
      "vi-VN": "Tiếng Việt",
      "zh-CN": "简体中文",
      "zh-TW": "繁體中文",
      "ru-RU": "Russian"
    },
    "messages": {
      "deleteConfirm": "Confirm Delete",
      "deleteDescription": "This action will permanently delete this knowledge base record and cannot be recovered. Are you sure you want to continue?",
      "deleteButton": "Delete",
      "operationSuccess": "Operation Successful",
      "loadError": "Failed to load"
    },
    "toolbar": {
      "searchPlaceholder": "Search knowledge...",
      "reset": "Reset",
      "sortModeHint": "Drag knowledge items to sort, click save when done",
      "editSort": "Edit Sort",
      "saveSort": "Save Sort",
      "allCategories": "All categories"
    }
  },
  "common": {
    "all": "All",
    "clear": "Clear",
    "selectAll": "Select all",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "save": "Save",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "close": "Close",
    "delete": {
      "success": "Deleted successfully",
      "failed": "Failed to delete"
    },
    "edit": "Edit",
    "view": "View",
    "toggleNavigation": "Toggle Navigation",
    "toggleSidebar": "Toggle Sidebar",
    "search": "Search...",
    "theme": {
      "label": "Theme",
      "light": "Light",
      "dark": "Dark",
      "system": "System"
    },
    "noMatch": "No matching options",
    "selectField": "Select {{name}}",
    "inputField": "Enter {{name}}",
    "pageNotImplemented": "This page is not implemented yet",
    "user": "User",
    "defaultEmail": "user@example.com",
    "settings": "Settings",
    "logout": "Logout",
    "copy": {
      "success": "Copied successfully",
      "failed": "Failed to copy",
      "error": "Copy failed",
      "errorLog": "Error copying to clipboard"
    },
    "submit": "Submit",
    "saving": "Saving...",
    "table": {
      "noData": "No data available",
      "pagination": {
        "selected": "{{selected}} of {{total}} items selected",
        "itemsPerPage": "Per page",
        "page": "Page",
        "pageOf": "Page {{page}} / {{total}}",
        "range": "{{from}}–{{to}} of {{total}}",
        "firstPage": "Go to first page",
        "previousPage": "Previous page",
        "nextPage": "Next page",
        "lastPage": "Go to last page"
      },
      "viewOptions": {
        "button": "Columns",
        "label": "Toggle columns"
      }
    },
    "update": {
      "title": "System Update",
      "newVersion": "New Version Available",
      "currentVersion": "Current Version",
      "latestVersion": "Latest Version",
      "updateLater": "Update Later",
      "updateNow": "Update Now",
      "updating": "Updating...",
      "updateSuccess": "Update successful, system will restart shortly",
      "updateFailed": "Update failed, please try again later"
    },
    "time": {
      "day": "day",
      "hour": " hour(s)"
    },
    "reset": "Reset",
    "export": "Export",
    "currency": {
      "yuan": "Yuan"
    },
    "http": {
      "notLoggedIn": "Not logged in",
      "unknownError": "Unknown error",
      "loginExpired": "Login expired",
      "loginExpiredRelogin": "Login expired, please sign in again",
      "unauthorized": "Unauthorized, please sign in again",
      "invalidCredentials": "Incorrect email or password",
      "invalidData": "Invalid data, please check your input",
      "requestFailed": "Request failed",
      "networkError": "Network error",
      "noPermission": "No permission",
      "notFound": "Resource or API not found",
      "unknownException": "Unknown exception",
      "success": "Operation successful"
    },
    "add": "Add",
    "refresh": "Refresh",
    "sort": {
      "edit": "Edit sort",
      "done": "Done sorting"
    },
    "actions": "Actions",
    "start": "From",
    "end": "To"
  },
  "plugin": {
    "title": "Plugin Management",
    "description": "Manage and configure system plugins",
    "search": {
      "placeholder": "Search plugin name or description..."
    },
    "type": {
      "placeholder": "Select Plugin Type",
      "all": "All Types"
    },
    "tabs": {
      "all": "All Plugins",
      "installed": "Installed",
      "available": "Available"
    },
    "status": {
      "enabled": "Enabled",
      "disabled": "Disabled",
      "not_installed": "Not Installed",
      "protected": "Protected",
      "filter_placeholder": "Install Status",
      "all": "All Status",
      "installed": "Installed",
      "available": "Available"
    },
    "button": {
      "install": "Install",
      "upgrade": "Upgrade",
      "config": "Configure",
      "enable": "Enable",
      "disable": "Disable",
      "uninstall": "Uninstall",
      "readme": "View Documentation",
      "menuDemo": "Menu Demo"
    },
    "upload": {
      "button": "Upload Plugin",
      "title": "Upload Plugin",
      "description": "Upload a plugin package (.zip)",
      "dragText": "Drag and drop plugin package here, or",
      "clickText": "browse",
      "supportText": "Supports .zip files only",
      "uploading": "Uploading...",
      "error": {
        "format": "Only .zip files are supported"
      }
    },
    "delete": {
      "title": "Delete Plugin",
      "description": "Are you sure you want to delete this plugin? This action cannot be undone.",
      "button": "Delete"
    },
    "uninstall": {
      "title": "Uninstall Plugin",
      "description": "Are you sure you want to uninstall this plugin? Plugin data will be cleared after uninstallation.",
      "button": "Uninstall"
    },
    "upgrade": {
      "title": "Upgrade Plugin",
      "description": "Are you sure you want to upgrade this plugin? The plugin will be temporarily unavailable during the upgrade process.",
      "button": "Upgrade"
    },
    "config": {
      "title": "Configuration",
      "description": "Modify plugin configuration",
      "save": "Save",
      "cancel": "Cancel",
      "noConfigs": "This plugin has no configurable options",
      "actions": "Actions",
      "selectPlan": "Select a plan",
      "noPlan": "No plan"
    },
    "readme": {
      "title": "Plugin Documentation",
      "empty": "No documentation"
    },
    "author": "Author",
    "messages": {
      "installSuccess": "Plugin installed successfully",
      "installError": "Failed to install plugin",
      "upgradeSuccess": "Plugin upgraded successfully",
      "upgradeError": "Failed to upgrade plugin",
      "uninstallSuccess": "Plugin uninstalled successfully",
      "uninstallError": "Failed to uninstall plugin",
      "enableSuccess": "Plugin enabled successfully",
      "enableError": "Failed to enable plugin",
      "disableSuccess": "Plugin disabled successfully",
      "disableError": "Failed to disable plugin",
      "configLoadError": "Failed to load plugin configuration",
      "configSaveSuccess": "Configuration saved successfully",
      "configSaveError": "Failed to save configuration",
      "uploadSuccess": "Plugin uploaded successfully",
      "uploadError": "Failed to upload plugin",
      "deleteSuccess": "Plugin deleted successfully",
      "deleteError": "Failed to delete plugin",
      "actionSuccess": "Action executed successfully",
      "actionError": "Failed to execute action",
      "actionLabel": "Action",
      "actionSuccessWithLabel": "{{label}} executed successfully",
      "actionErrorWithLabel": "{{label}} failed",
      "invalidJson": "{{field}} is not valid JSON"
    },
    "staticFiles": {
      "title": "HTML static files",
      "previewTitle": "Plugin HTML Preview",
      "backToList": "Back to list",
      "openInNewTab": "Open in new tab",
      "empty": "No static files"
    },
    "noPlugins": "No plugins",
    "toolbar": {
      "search": "Search plugins..."
    }
  },
  "dashboard": {
    "title": "Dashboard",
    "stats": {
      "newUsers": "New Users",
      "totalScore": "Total Score",
      "monthlyUpload": "Monthly Upload",
      "vsLastMonth": "vs Last Month",
      "vsYesterday": "vs Yesterday",
      "todayIncome": "Today's Income",
      "monthlyIncome": "Monthly Income",
      "totalIncome": "Total Income",
      "totalUsers": "Total Users",
      "activeUsers": "Active Users: {{count}}",
      "totalOrders": "Total Orders",
      "revenue": "Revenue",
      "todayRegistered": "Today Registered",
      "monthlyRegistered": "Monthly Registered",
      "onlineUsers": "Online Users",
      "pendingTickets": "Pending Tickets",
      "hasPendingTickets": "There are tickets that need attention",
      "noPendingTickets": "No pending tickets",
      "pendingCommission": "Pending Commission",
      "hasPendingCommission": "There are commissions that need confirmation",
      "noPendingCommission": "No pending commission",
      "monthlyNewUsers": "Monthly New Users",
      "monthlyDownload": "Monthly Download",
      "todayTraffic": "Today: {{value}}",
      "activeUserTrend": "Active User Trend",
      "realtimeUsers": "Realtime Users",
      "todayPeak": "Today's Peak",
      "vsLastWeek": "vs Last Week"
    },
    "trafficRank": {
      "nodeTrafficRank": "Node Traffic Rank",
      "userTrafficRank": "User Traffic Rank",
      "today": "Today",
      "last7days": "Last 7 Days",
      "last30days": "Last 30 Days",
      "customRange": "Custom Range",
      "selectTimeRange": "Select Time Range",
      "selectDateRange": "Select Date Range",
      "currentTraffic": "Current Traffic",
      "previousTraffic": "Previous Traffic",
      "changeRate": "Change Rate",
      "recordTime": "Record Time"
    },
    "overview": {
      "title": "Revenue Overview",
      "thisMonth": "This Month",
      "lastMonth": "Last Month",
      "to": "to",
      "selectTimeRange": "Select Range",
      "selectDate": "Select Date",
      "last7Days": "Last 7 Days",
      "last30Days": "Last 30 Days",
      "last90Days": "Last 90 Days",
      "last180Days": "Last 180 Days",
      "lastYear": "Last Year",
      "customRange": "Custom Range",
      "amount": "Amount",
      "count": "Count",
      "transactions": "{{count}} transactions",
      "orderAmount": "Order Amount",
      "commissionAmount": "Commission Amount",
      "orderCount": "Order Count",
      "commissionCount": "Commission Count",
      "totalIncome": "Total Income",
      "totalCommission": "Total Commission",
      "totalTransactions": "Total: {{count}} transactions",
      "avgOrderAmount": "Average Order Amount:",
      "commissionRate": "Commission Rate:"
    },
    "traffic": {
      "title": "Traffic Ranking",
      "rank": "Rank",
      "domain": "Domain",
      "todayTraffic": "Today's Traffic",
      "monthlyTraffic": "Monthly Traffic"
    },
    "queue": {
      "title": "Queue Status",
      "metrics": {
        "pending": "Pending {{count}}",
        "maxWait": "Max wait {{time}}",
        "backlog": "Backlog",
        "processes": "Processes",
        "pendingLabel": "Pending",
        "wait": "Wait"
      },
      "jobDetails": "Job Details",
      "workload": "Queue Workload",
      "workloadCount": "{{count}} queues",
      "status": {
        "description": "Horizon status and per-queue backlog",
        "running": "Running Status",
        "normal": "Normal",
        "abnormal": "Abnormal",
        "waitTime": "Current wait time: {{seconds}} seconds",
        "pending": "Pending",
        "processing": "Processing",
        "completed": "Completed",
        "failed": "Failed",
        "cancelled": "Cancelled"
      },
      "details": {
        "description": "Queue processing details",
        "recentJobs": "Recent Jobs",
        "statisticsPeriod": "Statistics Period: {{hours}} hours",
        "jobsPerMinute": "Jobs Per Minute",
        "maxThroughput": "Max Throughput: {{value}}",
        "failedJobs7Days": "Failed Jobs (7 days)",
        "retentionPeriod": "Retention Period: {{hours}} hours",
        "longestRunningQueue": "Longest Running Queue",
        "activeProcesses": "Active Processes",
        "id": "Job ID",
        "type": "Job Type",
        "status": "Status",
        "progress": "Progress",
        "createdAt": "Created At",
        "updatedAt": "Updated At",
        "error": "Error Message",
        "data": "Job Data",
        "result": "Result",
        "duration": "Duration",
        "attempts": "Attempts",
        "nextRetry": "Next Retry",
        "failedJobsDetailTitle": "Failed Jobs Details",
        "viewFailedJobs": "View Failed Jobs",
        "jobDetailTitle": "Job Details",
        "time": "Time",
        "queue": "Queue",
        "name": "Job Name",
        "exception": "Exception",
        "noException": "No exception info",
        "noFailedJobs": "No failed jobs",
        "connection": "Connection",
        "payload": "Job Payload",
        "viewDetail": "View Details",
        "action": "Action"
      },
      "actions": {
        "retry": "Retry",
        "cancel": "Cancel",
        "delete": "Delete",
        "viewDetails": "View Details"
      },
      "empty": "No jobs in queue",
      "loading": "Loading queue status...",
      "error": "Failed to load queue status"
    },
    "common": {
      "refresh": "Refresh",
      "close": "Close",
      "pagination": "Page {{current}}/{{total}}, {{count}} items total"
    },
    "search": {
      "placeholder": "Search menus and functions...",
      "title": "Menu Navigation",
      "noResults": "No results found",
      "loading": "Searching..."
    }
  },
  "order": {
    "title": "Order Management",
    "description": "Here you can view user orders, including assignment, viewing, deletion and other operations.",
    "table": {
      "columns": {
        "tradeNo": "Order No.",
        "type": "Type",
        "user": "User",
        "plan": "Subscription Plan",
        "period": "Period",
        "amount": "Payment Amount",
        "status": "Order Status",
        "commission": "Commission",
        "commissionStatus": "Commission Status",
        "createdAt": "Created At",
        "actions": "Actions"
      }
    },
    "type": {
      "NEW": "New Purchase",
      "RENEWAL": "Renewal",
      "UPGRADE": "Upgrade",
      "RESET_FLOW": "Reset Traffic",
      "DEPOSIT": "Balance Deposit"
    },
    "period": {
      "hour_price": "Hourly",
      "day_price": "Daily",
      "month_price": "Monthly",
      "quarter_price": "Quarterly",
      "half_year_price": "Semi-annually",
      "year_price": "Annually",
      "two_year_price": "2 Years",
      "three_year_price": "3 Years",
      "onetime_price": "One-time",
      "reset_price": "Reset Package",
      "deposit": "Balance Deposit",
      "hourly": "Hourly",
      "daily": "Daily",
      "half_yearly": "Semi-annually",
      "monthly": "Monthly",
      "onetime": "One-time",
      "quarterly": "Quarterly",
      "reset_traffic": "Reset Traffic",
      "three_yearly": "3 Years",
      "two_yearly": "2 Years",
      "yearly": "Annually"
    },
    "status": {
      "PENDING": "Pending",
      "PROCESSING": "Processing",
      "CANCELLED": "Cancelled",
      "COMPLETED": "Completed",
      "DISCOUNTED": "Discounted",
      "tooltip": "After marking as [Paid], the system will proceed with activation and completion"
    },
    "commission": {
      "PENDING": "Pending",
      "PROCESSING": "Processing",
      "VALID": "Valid",
      "INVALID": "Invalid"
    },
    "filter": {
      "allTypes": "All types",
      "allPeriods": "All periods",
      "allStatuses": "All statuses",
      "allCommissions": "All commission statuses",
      "userId": "User ID",
      "clear": "Clear",
      "clearAll": "Clear filters"
    },
    "actions": {
      "view": "View Details",
      "markAsPaid": "Mark as Paid",
      "cancel": "Cancel Order",
      "issue": "Issue Commission",
      "invalid": "Mark Commission Invalid",
      "openMenu": "Open Menu",
      "reset": "Reset",
      "copyTradeNo": "Copy order no."
    },
    "search": {
      "placeholder": "Search order no...."
    },
    "dialog": {
      "title": "Order Information",
      "basicInfo": "Basic Information",
      "amountInfo": "Amount Information",
      "timeInfo": "Time Information",
      "commissionInfo": "Commission Information",
      "commissionStatusActive": "Active",
      "addOrder": "Add Order",
      "assignOrder": "Assign Order",
      "fields": {
        "userEmail": "User Email",
        "userPhone": "User Phone",
        "orderPeriod": "Order Period",
        "subscriptionPlan": "Subscription Plan",
        "callbackNo": "Callback No.",
        "paymentAmount": "Payment Amount",
        "balancePayment": "Balance Payment",
        "discountAmount": "Discount Amount",
        "refundAmount": "Refund Amount",
        "deductionAmount": "Deduction Amount",
        "createdAt": "Created At",
        "updatedAt": "Updated At",
        "commissionStatus": "Commission Status",
        "commissionAmount": "Commission Amount",
        "actualCommissionAmount": "Actual Commission",
        "inviteUser": "Inviter",
        "inviteUserId": "Inviter ID"
      },
      "placeholders": {
        "email": "Please enter user email",
        "plan": "Please select subscription plan",
        "period": "Please select subscription period",
        "amount": "Please enter payment amount"
      },
      "actions": {
        "cancel": "Cancel",
        "confirm": "Confirm"
      },
      "messages": {
        "addSuccess": "Added successfully",
        "addOrder": "Add Order"
      }
    },
    "messages": {
      "addSuccess": "Added successfully",
      "markPaidSuccess": "Marked as paid",
      "cancelSuccess": "Order cancelled",
      "cancelConfirm": "Are you sure you want to cancel this order?",
      "commissionIssueSuccess": "Commission issued",
      "commissionInvalidSuccess": "Commission marked as invalid",
      "commissionInvalidConfirm": "Mark this commission as invalid?"
    }
  },
  "theme": {
    "title": "Theme Configuration",
    "description": "Theme configuration, including theme colors, font sizes, etc. If you deploy V2board in a front-end and back-end separated way, theme configuration will not take effect.",
    "upload": {
      "button": "Upload Theme",
      "title": "Upload Theme",
      "description": "Please upload a valid theme package (.zip format). The theme package should contain a complete theme file structure.",
      "dragText": "Drag and drop theme file here, or",
      "clickText": "click to select",
      "supportText": "Supports .zip format theme packages",
      "uploading": "Uploading...",
      "success": "Upload successful",
      "error": {
        "format": "Only ZIP format theme files are supported"
      }
    },
    "preview": {
      "title": "Theme Preview",
      "imageCount": "{{current}} / {{total}}"
    },
    "card": {
      "version": "Version: {{version}}",
      "currentTheme": "Current Theme",
      "activateTheme": "Activate Theme",
      "activateSuccess": "Theme activated",
      "configureTheme": "Theme Settings",
      "preview": "Preview",
      "delete": {
        "title": "Delete Theme",
        "description": "Are you sure you want to delete this theme? This action cannot be undone.",
        "button": "Delete",
        "error": {
          "active": "Cannot delete the currently active theme"
        }
      }
    },
    "config": {
      "title": "Configure {{name}} Theme",
      "description": "Modify theme styles, layouts, and other display options.",
      "cancel": "Cancel",
      "save": "Save",
      "success": "Settings saved successfully",
      "noConfigs": "This theme has no configurable options",
      "error": "Save failed"
    }
  }
};

window.FBOARD_TRANSLATIONS = window.FBOARD_TRANSLATIONS ?? {};
window.FBOARD_TRANSLATIONS["en-US"] = translations;
