import type { Translations } from "./global";

const translations: Translations = {
  "giftCard": {
    "title": "礼品卡管理",
    "description": "在这里可以管理礼品卡模板、兑换码和使用记录等功能。",
    "tabs": {
      "templates": "模板管理",
      "codes": "兑换码管理",
      "usages": "使用记录",
      "statistics": "统计数据"
    },
    "template": {
      "title": "模板管理",
      "description": "管理礼品卡模板，包括创建、编辑和删除模板。",
      "table": {
        "title": "模板列表",
        "columns": {
          "id": "ID",
          "name": "名称",
          "type": "类型",
          "status": "状态",
          "sort": "排序",
          "rewards": "奖励内容",
          "created_at": "创建时间",
          "actions": "操作",
          "no_rewards": "无奖励"
        }
      },
      "form": {
        "add": "添加模板",
        "edit": "编辑模板",
        "name": {
          "label": "模板名称",
          "placeholder": "请输入模板名称",
          "required": "请输入模板名称"
        },
        "sort": {
          "label": "排序",
          "placeholder": "数字越小越靠前"
        },
        "type": {
          "label": "类型",
          "placeholder": "请选择礼品卡类型"
        },
        "description": {
          "label": "描述",
          "placeholder": "请输入礼品卡描述"
        },
        "status": {
          "label": "状态",
          "description": "禁用后，此模板将无法生成或兑换新的礼品卡。"
        },
        "display": {
          "title": "显示效果",
          "theme_color": {
            "label": "主题颜色"
          },
          "icon": {
            "label": "图标",
            "placeholder": "请输入图标的URL"
          },
          "background_image": {
            "label": "背景图片",
            "placeholder": "请输入背景图片的URL"
          }
        },
        "conditions": {
          "title": "使用条件",
          "new_user_max_days": {
            "label": "新用户注册天数限制",
            "placeholder": "例如: 7 (仅限注册7天内的用户)"
          },
          "new_user_only": {
            "label": "仅限新用户",
            "hint": "需注册天数 ≤ {{days}}"
          },
          "paid_user_only": {
            "label": "仅限付费用户"
          },
          "require_invite": {
            "label": "需要邀请关系"
          },
          "allowed_plans": {
            "label": "允许的套餐",
            "placeholder": "选择允许兑换的套餐 (留空则不限制)"
          },
          "disallowed_plans": {
            "label": "禁止的套餐",
            "placeholder": "选择禁止兑换的套餐 (留空则不限制)"
          }
        },
        "limits": {
          "title": "使用限制",
          "max_use_per_user": {
            "label": "单用户最大使用次数",
            "placeholder": "留空则不限制"
          },
          "cooldown_hours": {
            "label": "同类卡冷却时间(小时)",
            "placeholder": "留空则不限制"
          }
        },
        "rewards": {
          "title": "奖励内容",
          "invite_reward_rate": {
            "label": "邀请人奖励比例",
            "placeholder": "例如: 0.2 (代表20%)",
            "description": "使用者有邀请人时，给邀请人的奖励 = 余额奖励 * 此比例"
          },
          "balance": {
            "label": "奖励余额 (元)",
            "short_label": "余额",
            "placeholder": "请输入奖励的金额(元)"
          },
          "transfer_enable": {
            "label": "奖励流量 (GB)",
            "short_label": "流量",
            "placeholder": "请输入奖励的流量(GB)"
          },
          "expire_days": {
            "label": "延长有效期 (天)",
            "short_label": "有效期",
            "placeholder": "请输入延长的天数"
          },
          "transfer": {
            "label": "奖励流量 (字节)",
            "placeholder": "请输入奖励的流量(字节)"
          },
          "days": {
            "label": "延长有效期 (天)",
            "placeholder": "请输入延长的天数"
          },
          "device_limit": {
            "label": "增加设备数",
            "short_label": "设备数",
            "placeholder": "请输入增加的设备数量"
          },
          "reset_package": {
            "label": "重置当月流量",
            "description": "开启后，兑换时会将用户当前套餐的已用流量清零。"
          },
          "reset_count": {
            "description": "该类型卡将重置用户当月的流量使用。"
          },
          "task_card": {
            "description": "任务礼品卡的具体奖励将在任务系统中配置。"
          },
          "plan_id": {
            "label": "指定套餐",
            "short_label": "套餐",
            "placeholder": "请选择一个套餐"
          },
          "plan_validity_days": {
            "label": "套餐有效期 (天)",
            "short_label": "套餐有效期",
            "placeholder": "留空则使用套餐默认有效期"
          },
          "random_rewards": {
            "label": "随机奖励池",
            "add": "添加随机奖励项",
            "weight": "权重"
          }
        },
        "special_config": {
          "title": "特殊配置",
          "start_time": {
            "label": "活动开始时间",
            "placeholder": "请选择开始日期"
          },
          "end_time": {
            "label": "活动结束时间",
            "placeholder": "请选择结束日期"
          },
          "festival_bonus": {
            "label": "节日奖励乘数",
            "placeholder": "例如: 1.5 (代表1.5倍)"
          }
        },
        "submit": {
          "saving": "保存中...",
          "save": "保存"
        }
      },
      "actions": {
        "edit": "编辑",
        "delete": "删除",
        "deleteConfirm": {
          "title": "确认删除",
          "description": "此操作将永久删除该模板，确定要继续吗？",
          "confirmText": "删除"
        }
      }
    },
    "code": {
      "title": "兑换码管理",
      "form": {
        "generate": "生成兑换码",
        "template_id": {
          "label": "选择模板",
          "placeholder": "请选择一个模板来生成兑换码"
        },
        "count": {
          "label": "生成数量"
        },
        "prefix": {
          "label": "自定义前缀 (可选)"
        },
        "expires_hours": {
          "label": "有效期 (小时)"
        },
        "max_usage": {
          "label": "最大使用次数"
        },
        "download_csv": "导出CSV",
        "submit": {
          "generating": "生成中...",
          "generate": "立即生成"
        }
      },
      "description": "管理礼品卡兑换码，包括生成、查看和导出兑换码。",
      "generate": {
        "title": "生成兑换码",
        "template": "选择模板",
        "count": "生成数量",
        "prefix": "自定义前缀",
        "expires_hours": "有效期 (小时)",
        "max_usage": "最大使用次数",
        "submit": "生成"
      },
      "table": {
        "title": "兑换码列表",
        "columns": {
          "id": "ID",
          "code": "兑换码",
          "template_name": "模板名称",
          "status": "状态",
          "expires_at": "过期时间",
          "usage_count": "已用次数",
          "max_usage": "可用次数",
          "created_at": "创建时间"
        }
      },
      "actions": {
        "enable": "启用",
        "disable": "禁用",
        "export": "导出",
        "exportConfirm": {
          "title": "确认导出",
          "description": "将导出选定批次的所有兑换码为文本文件。确定要继续吗？",
          "confirmText": "导出"
        }
      },
      "status": {
        "0": "未使用",
        "1": "已使用",
        "2": "已过期",
        "3": "已禁用"
      },
      "edit": {
        "title": "编辑礼品码",
        "code": "礼品码",
        "template": "模板",
        "templatePlaceholder": "请选择模板",
        "maxUsage": "最大使用次数",
        "status": "状态",
        "expiresAt": "过期时间"
      },
      "messages": {
        "enabled": "已启用",
        "disabled": "已禁用",
        "exportSuccess": "导出成功",
        "deleteConfirmTitle": "确认删除",
        "deleteConfirmDescription": "确定要删除礼品码 {{code}} 吗？此操作不可撤销。",
        "deleteSuccess": "删除成功",
        "selectTemplate": "请选择模板",
        "updateSuccess": "更新成功"
      }
    },
    "usage": {
      "title": "使用记录",
      "description": "查看礼品卡的使用记录和详细信息。",
      "table": {
        "columns": {
          "id": "ID",
          "code": "兑换码",
          "template_name": "模板名称",
          "user_email": "用户邮箱",
          "rewards_given": "获得奖励",
          "invite_rewards": "邀请奖励",
          "multiplier_applied": "倍数加成",
          "ip_address": "IP地址",
          "created_at": "使用时间",
          "actions": "操作"
        }
      },
      "actions": {
        "view": "查看详情"
      }
    },
    "statistics": {
      "title": "统计数据",
      "description": "查看礼品卡的统计数据和使用情况分析。",
      "total": {
        "title": "总体统计",
        "templates_count": "模板总数",
        "active_templates_count": "活跃模板数",
        "codes_count": "兑换码总数",
        "used_codes_count": "已使用兑换码",
        "usages_count": "使用记录数"
      },
      "daily": {
        "title": "每日使用量",
        "chart": "使用量趋势图"
      },
      "type": {
        "title": "类型统计",
        "chart": "类型分布图"
      },
      "dateRange": {
        "label": "日期范围",
        "start": "开始日期",
        "end": "结束日期"
      }
    },
    "types": {
      "1": "通用礼品卡",
      "2": "套餐礼品卡",
      "3": "盲盒礼品卡",
      "4": "任务礼品卡"
    },
    "common": {
      "search": "搜索礼品卡...",
      "reset": "重置",
      "filter": "筛选",
      "export": "导出",
      "refresh": "刷新",
      "back": "返回",
      "close": "关闭",
      "confirm": "确认",
      "cancel": "取消",
      "enabled": "已启用",
      "disabled": "已禁用",
      "loading": "加载中...",
      "noData": "暂无数据",
      "success": "操作成功",
      "error": "操作失败"
    },
    "messages": {
      "formInvalid": "请检查表单输入是否正确",
      "templateCreated": "模板创建成功",
      "templateUpdated": "模板更新成功",
      "templateDeleted": "模板删除成功",
      "codeGenerated": "兑换码生成成功",
      "generateCodeFailed": "兑换码生成失败",
      "codeStatusUpdated": "兑换码状态更新成功",
      "updateCodeStatusFailed": "兑换码状态更新失败",
      "codesExported": "兑换码导出成功",
      "createTemplateFailed": "创建模板失败",
      "updateTemplateFailed": "更新模板失败",
      "deleteTemplateFailed": "删除模板失败",
      "loadDataFailed": "加载数据失败",
      "codesGenerated": "兑换码生成成功"
    }
  },
  "user": {
    "manage": {
      "title": "用户管理",
      "description": "在这里可以管理用户，包括增加、删除、编辑、查询等操作。"
    },
    "columns": {
      "is_admin": "管理员",
      "is_staff": "员工",
      "id": "ID",
      "email": "邮箱",
      "online_count": "在线设备",
      "status": "状态",
      "subscription": "订阅",
      "group": "权限组",
      "used_traffic": "已用流量",
      "total_traffic": "总流量",
      "expire_time": "到期时间",
      "balance": "余额",
      "commission": "佣金",
      "register_time": "注册时间",
      "invitee_email": "邀请用户",
      "actions": "操作",
      "next_reset_at": "下次重置时间",
      "device_limit": {
        "unlimited": "无设备数限制",
        "limited": "最多可同时在线 {{count}} 台设备"
      },
      "status_text": {
        "normal": "正常",
        "banned": "已封禁"
      },
      "online_status": {
        "online": "当前在线",
        "never": "从未在线",
        "last_online": "最后在线时间: {{time}}",
        "offline_duration": {
          "days": "离线时长: {{count}}天",
          "hours": "离线时长: {{count}}小时",
          "minutes": "离线时长: {{count}}分钟",
          "seconds": "离线时长: {{count}}秒"
        }
      },
      "expire_status": {
        "permanent": "长期有效",
        "expired": "已过期 {{days}} 天",
        "remaining": "剩余 {{days}} 天"
      },
      "copy_email": "复制邮箱",
      "actions_menu": {
        "edit": "编辑",
        "view_details": "查看详情",
        "assign_order": "分配订单",
        "copy_url": "复制订阅URL",
        "reset_secret": "重置UUID及订阅URL",
        "reset_traffic": "重置流量",
        "orders": "TA的订单",
        "invites": "TA的邀请",
        "traffic_records": "TA的流量记录",
        "login_history": "登录历史",
        "delete": "删除",
        "delete_confirm_title": "确认删除用户",
        "delete_confirm_description": "此操作将永久删除用户 {{email}} 及其所有相关数据，包括订单、优惠码、流量记录、工单记录等信息。删除后无法恢复，是否继续？"
      }
    },
    "filter": {
      "selected": "已选择 {{count}} 项",
      "clear_selection": "取消选择",
      "no_results": "未找到结果",
      "clear": "清除筛选",
      "search_placeholder": "搜索...",
      "email_search": "搜索用户邮箱...",
      "advanced": "高级筛选",
      "reset": "重置筛选",
      "sheet": {
        "title": "高级筛选",
        "description": "添加一个或多个筛选条件来精确查找用户",
        "conditions": "筛选条件",
        "add": "添加条件",
        "condition": "条件 {{number}}",
        "field": "选择字段",
        "operator": "选择操作符",
        "value": "输入值",
        "value_number": "输入数值({{unit}})",
        "reset": "重置",
        "apply": "应用筛选"
      },
      "fields": {
        "email": "邮箱",
        "phone": "手机号",
        "id": "用户ID",
        "plan_id": "订阅",
        "transfer_enable": "流量",
        "total_used": "已用流量",
        "online_count": "在线设备",
        "expired_at": "到期时间",
        "uuid": "UUID",
        "token": "Token",
        "banned": "账号状态",
        "remark": "备注",
        "inviter_email": "邀请人邮箱",
        "invite_user_id": "邀请人ID",
        "is_admin": "管理员",
        "is_staff": "员工"
      },
      "operators": {
        "contains": "包含",
        "eq": "等于",
        "gt": "大于",
        "lt": "小于"
      },
      "status": {
        "normal": "正常",
        "banned": "禁用"
      },
      "boolean": {
        "true": "是",
        "false": "否"
      }
    },
    "generate": {
      "button": "创建用户",
      "title": "创建用户",
      "description_single": "创建单个指定邮箱账号",
      "description_batch": "批量生成随机邮箱账号",
      "form": {
        "email": "邮箱",
        "email_prefix": "帐号(批量生成请留空)",
        "email_prefix_placeholder": "留空则批量随机",
        "email_domain": "域",
        "password": "密码",
        "password_placeholder": "留空则密码与邮件相同",
        "expire_time": "到期时间",
        "expire_time_placeholder": "请选择用户到期日期，留空为长期有效",
        "permanent": "长期有效",
        "subscription": "订阅计划",
"plans": "套餐列表",
"add_plan": "添加套餐",
        "subscription_none": "无",
        "generate_count": "生成数量",
        "generate_count_placeholder": "如果为批量生产请输入生成数量",
        "cancel": "取消",
        "submit": "生成",
        "success": "生成成功",
        "download_csv": "导出为 CSV 文件",
        "generated_count": "已生成 {{count}} 个账号",
        "single_success_hint": "账号已创建，可在用户列表中查看与编辑。",
        "copy_all": "复制全部",
        "copy_email": "复制邮箱",
        "copy_subscribe": "复制订阅",
        "result_password": "密码",
        "result_expire": "到期"
      },
      "copy_line": {
        "email": "邮箱: {{value}}",
        "password": "密码: {{value}}",
        "expire": "到期: {{value}}",
        "subscribe": "订阅: {{value}}"
      },
      "csv": {
        "email": "邮箱",
        "password": "密码",
        "expire_time": "到期时间",
        "uuid": "UUID",
        "created_at": "创建时间",
        "subscribe_url": "订阅地址"
      }
    },
    "edit": {
      "button": "编辑用户信息",
      "title": "用户管理",
      "form": {
        "email": "邮箱",
        "phone_country": "国家/地区",
        "phone": "手机号",
        "phone_placeholder": "请输入手机号",
        "email_placeholder": "请输入邮箱",
        "inviter_email": "邀请人邮箱",
        "inviter_email_placeholder": "请输入邮箱",
        "invite_user_id": "邀请人ID",
        "invite_user_id_placeholder": "请输入邀请人用户ID，留空则清空",
        "password": "密码",
        "password_placeholder": "如需修改密码请输入",
        "balance": "余额",
        "balance_placeholder": "请输入余额",
        "commission_balance": "佣金余额",
        "commission_balance_placeholder": "请输入佣金余额",
        "upload": "已用上行",
        "upload_placeholder": "已用上行",
        "download": "已用下行",
        "download_placeholder": "已用下行",
        "total_traffic": "流量",
        "total_traffic_placeholder": "请输入流量",
        "expire_time": "到期时间",
        "expire_time_placeholder": "请选择用户到期日期，留空为长期有效",
        "expire_time_specific": "具体时间",
        "expire_time_today": "设为当天结束",
        "expire_time_permanent": "长期有效",
        "expire_time_1month": "一个月",
        "expire_time_3months": "三个月",
        "expire_time_confirm": "确定",
        "subscription": "订阅计划",
        "subscription_none": "无",
        "account_status": "账户状态",
        "banned_hint": "用户无法登录、无法使用订阅服务",
        "normal_hint": "用户可以正常使用所有服务",
        "commission_type": "佣金类型",
        "commission_type_system": "跟随系统设置",
        "commission_type_cycle": "循环返利",
        "commission_type_onetime": "首次返利",
        "commission_rate": "推荐返利比例",
        "commission_rate_placeholder": "为空则跟随站点设置返利比例",
        "discount": "专享折扣比例",
        "discount_placeholder": "为空则不享受专享折扣",
        "speed_limit": "限速",
        "speed_limit_placeholder": "留空则不限速",
        "device_limit": "设备限制",
        "device_limit_placeholder": "留空则不限制",
        "is_admin": "是否管理员",
        "is_staff": "是否员工",
        "remarks": "备注",
        "remarks_placeholder": "请在这里记录",
        "cancel": "取消",
        "submit": "提交",
        "success": "修改成功"
      }
    },
    "actions": {
      "title": "操作",
      "send_email": "发送邮件",
      "export_csv": "导出 CSV",
      "traffic_reset_stats": "流量重置统计",
      "batch_ban": "批量封禁",
      "confirm_ban": {
        "title": "确认批量封禁",
        "filtered_description": "此操作将封禁所有符合当前筛选条件的用户。此操作无法撤销。",
        "all_description": "此操作将封禁系统中的所有用户。此操作无法撤销。",
        "cancel": "取消",
        "confirm": "确认封禁",
        "banning": "封禁中..."
      }
    },
    "traffic_reset": {
      "title": "流量重置",
      "description": "为用户 {{email}} 重置流量使用量",
      "tabs": {
        "reset": "重置流量",
        "history": "重置历史"
      },
      "user_info": "用户信息",
      "warning": {
        "title": "重要提醒",
        "irreversible": "流量重置操作不可逆，请谨慎操作",
        "reset_to_zero": "重置后用户的上传和下载流量将清零",
        "logged": "所有重置操作都会被记录在系统日志中"
      },
      "reason": {
        "label": "重置原因",
        "placeholder": "请输入重置流量的原因（可选）",
        "optional": "此字段为可选项，用于记录重置原因"
      },
      "confirm_reset": "确认重置",
      "resetting": "重置中...",
      "reset_success": "流量重置成功",
      "reset_failed": "流量重置失败",
      "history": {
        "summary": "重置概览",
        "reset_count": "重置次数",
        "last_reset": "最后重置",
        "next_reset": "下次重置",
        "never": "从未重置",
        "no_schedule": "无定时重置",
        "records": "重置记录",
        "recent_records": "最近10次重置记录",
        "no_records": "暂无重置记录",
        "reset_time": "重置时间",
        "traffic_cleared": "清除流量"
      },
      "stats": {
        "title": "流量重置统计",
        "description": "查看系统流量重置的统计信息",
        "time_range": "统计时间范围",
        "total_resets": "总重置次数",
        "auto_resets": "自动重置",
        "manual_resets": "手动重置",
        "cron_resets": "定时重置",
        "in_period": "最近 {{days}} 天",
        "breakdown": "重置类型分布",
        "breakdown_description": "各类型重置操作的百分比分布",
        "auto_percentage": "自动重置占比",
        "manual_percentage": "手动重置占比",
        "cron_percentage": "定时重置占比",
        "days_options": {
          "week": "最近一周",
          "month": "最近一月",
          "quarter": "最近三月",
          "year": "最近一年"
        }
      }
    },
    "traffic_reset_logs": {
      "title": "流量重置日志",
      "description": "查看系统中所有流量重置操作的详细记录",
      "columns": {
        "id": "日志ID",
        "user": "用户",
        "reset_type": "重置类型",
        "trigger_source": "触发源",
        "cleared_traffic": "清除流量",
        "cleared": "已清除",
        "upload": "上传",
        "download": "下载",
        "reset_time": "重置时间",
        "log_time": "记录时间"
      },
      "filters": {
        "search_user": "搜索用户邮箱...",
        "reset_type": "重置类型",
        "trigger_source": "触发源",
        "all_types": "全部类型",
        "all_sources": "全部来源",
        "start_date": "开始日期",
        "end_date": "结束日期",
        "apply_date": "应用筛选",
        "reset": "重置筛选",
        "filter_title": "筛选条件",
        "filter_description": "设置筛选条件来查找特定的流量重置记录",
        "reset_types": {
          "monthly": "按月重置",
          "first_day_month": "每月1号重置",
          "yearly": "按年重置",
          "first_day_year": "每年1月1日重置",
          "manual": "手动重置"
        },
        "trigger_sources": {
          "auto": "自动触发",
          "manual": "手动触发",
          "cron": "定时任务"
        }
      },
      "actions": {
        "export": "导出日志",
        "exporting": "导出中...",
        "export_success": "导出成功",
        "export_failed": "导出失败"
      },
      "trigger_descriptions": {
        "manual": "管理员手动执行的流量重置",
        "cron": "系统定时任务自动执行",
        "auto": "系统根据条件自动触发",
        "other": "其他方式触发"
      }
    },
    "login_history": {
      "title": "登录历史",
      "no_records": "暂无登录记录",
      "columns": {
        "time": "时间",
        "ip": "IP",
        "method": "方式",
        "user_agent": "User-Agent"
      },
      "methods": {
        "password": "密码登录",
        "register": "注册",
        "mail_link": "邮件链接"
      }
    },
    "messages": {
      "success": "成功",
      "error": "错误",
      "export": {
        "success": "导出成功",
        "failed": "导出失败"
      },
      "batch_ban": {
        "success": "批量封禁成功",
        "failed": "批量封禁失败"
      },
      "send_mail": {
        "success": "邮件发送成功",
        "failed": "邮件发送失败",
        "required_fields": "请填写所有必填字段"
      },
      "reset_secret": {
        "success": "UUID & Token 已重置"
      }
    },
    "send_mail": {
      "title": "发送邮件",
      "description": "向所选或已筛选的用户发送邮件",
      "subject": "主题",
      "content": "内容",
      "sending": "发送中...",
      "send": "发送"
    },
    "dialog": {
      "title": "用户详情",
      "basicInfo": "基本信息",
      "subscriptionInfo": "订阅信息",
      "trafficInfo": "流量信息",
      "financialInfo": "财务信息",
      "activityInfo": "活动信息",
      "inviteInfo": "邀请信息",
      "timeInfo": "时间信息",
      "subscriptionUrl": "订阅链接",
      "fields": {
        "userId": "用户ID",
        "email": "邮箱",
        "phone": "手机号",
        "uuid": "UUID",
        "token": "Token",
        "remarks": "备注",
        "subscriptionPlan": "订阅套餐",
        "permissionGroup": "权限组",
        "expiredAt": "到期时间",
        "deviceLimit": "设备限制",
        "speedLimit": "速度限制",
        "transferEnable": "总流量",
        "uploadUsed": "上传已用",
        "downloadUsed": "下载已用",
        "totalUsed": "总已用",
        "lastResetAt": "上次重置",
        "nextResetAt": "下次重置",
        "resetCount": "重置次数",
        "balance": "余额",
        "commissionBalance": "佣金余额",
        "commissionType": "佣金类型",
        "commissionRate": "佣金比例",
        "lastLoginAt": "最后登录",
        "lastLoginIp": "最后登录IP",
        "registerIp": "注册IP",
        "lastOnlineAt": "最后在线",
        "onlineCount": "在线设备",
        "inviteUser": "邀请人",
        "inviteUserId": "邀请人ID",
        "createdAt": "创建时间",
        "updatedAt": "更新时间",
        "subscribeUrl": "订阅链接",
        "telegramId": "Telegram ID"
      }
    },
    "status": {
      "normal": "正常",
      "banned": "已封禁",
      "admin": "管理员",
      "staff": "员工"
    }
  },
  "nav": {
    "dashboard": "仪表盘",
    "systemManagement": "系统管理",
    "systemConfig": "系统配置",
    "themeConfig": "主题配置",
    "pluginManagement": "插件管理",
    "pluginMenuDemo": "插件菜单（演示）",
    "noticeManagement": "公告管理",
    "paymentConfig": "支付配置",
    "knowledgeManagement": "知识库管理",
    "nodeManagement": "节点管理",
    "machineManagement": "服务器管理",
    "permissionGroupManagement": "权限组管理",
    "routeManagement": "路由管理",
    "subscriptionManagement": "订阅管理",
    "planManagement": "套餐管理",
    "orderManagement": "订单管理",
    "couponManagement": "优惠券管理",
    "giftCardManagement": "礼品卡管理",
    "userManagement": "用户管理",
    "ticketManagement": "工单管理",
    "withdrawalManagement": "提现管理",
    "trafficResetLogs": "流量重置日志",
    "pluginApps": "插件应用"
  },
  "subscribe": {
    "plan": {
      "title": "订阅套餐",
      "add": "添加套餐",
      "search": "搜索套餐...",
      "sort": {
        "edit": "编辑排序",
        "save": "保存排序"
      },
      "columns": {
        "id": "ID",
        "show": "显示",
        "sell": "新购",
        "renew": "续费",
        "renew_tooltip": "在订阅停止销售时，已购用户是否可以续费",
        "name": "名称",
        "users": "总用户",
        "active_users": "活跃用户",
        "stats": "统计",
        "group": "权限组",
        "price": "价格",
        "actions": "操作",
        "edit": "编辑",
        "delete": "删除",
        "delete_confirm": {
          "title": "确认删除",
          "description": "此操作将永久删除该订阅，删除后无法恢复。确定要继续吗？",
          "success": "删除成功"
        },
        "price_period": {
          "hourly": "时付",
          "daily": "日付",
          "monthly": "月付",
          "quarterly": "季付",
          "half_yearly": "半年付",
          "yearly": "年付",
          "two_yearly": "两年付",
          "three_yearly": "三年付",
          "onetime": "流量包",
          "reset_traffic": "重置包",
          "no_price": "无价格",
          "unit": {
            "hour": "元/时",
            "day": "元/天",
            "month": "元/月",
            "quarter": "元/季",
            "half_year": "元/半年",
            "year": "元/年",
            "two_year": "元/两年",
            "three_year": "元/三年",
            "times": "元/次"
          }
        }
      },
      "form": {
        "add_title": "添加套餐",
        "edit_title": "编辑套餐",
        "name": {
          "label": "套餐名称",
          "placeholder": "请输入套餐名称",
          "required": "请输入套餐名称"
        },
        "group": {
          "label": "权限组",
          "add": "添加权限组",
          "placeholder": "请选择权限组",
          "none": "不绑定权限组"
        },
        "transfer": {
          "label": "流量",
          "placeholder": "请输入流量限制",
          "unit": "GB",
          "hint": "套餐包含的流量配额，单位为 GB"
        },
        "speed": {
          "label": "速度限制",
          "placeholder": "0 表示不限制",
          "unit": "Mbps",
          "hint": "单用户限速，0 或留空表示不限制"
        },
        "price": {
          "title": "价格设置",
          "base_price": "基础价格",
          "clear": {
            "button": "清空",
            "tooltip": "清空所有价格"
          },
          "period": {
            "monthly": "每月",
            "months": "{{count}}个月"
          },
          "onetime_desc": "一次性流量包，无时间限制",
          "reset_desc": "重置流量包，可多次使用"
        },
        "device": {
          "label": "设备限制",
          "placeholder": "0 表示不限制",
          "unit": "台",
          "hint": "同时在线设备数，0 或留空表示不限制"
        },
        "capacity": {
          "label": "容量限制",
          "placeholder": "0 表示不限制",
          "unit": "人",
          "hint": "可售卖名额上限，0 或留空表示不限制"
        },
        "tags": {
          "label": "标签",
          "placeholder": "输入标签后按回车确认"
        },
        "reset_method": {
          "label": "流量重置方式",
          "placeholder": "请选择重置方式",
          "description": "流量重置方式将决定如何重置流量",
          "options": {
            "follow_system": "跟随系统设置",
            "monthly_first": "每月首日",
            "monthly_reset": "每月购买日",
            "no_reset": "不重置",
            "yearly_first": "每年首日",
            "yearly_reset": "每年购买日"
          }
        },
        "content": {
          "label": "套餐说明",
          "placeholder": "请输入套餐说明",
          "description": "支持 Markdown 格式",
          "preview": "预览",
          "preview_button": {
            "show": "显示预览",
            "hide": "隐藏预览"
          },
          "template": {
            "button": "使用模板",
            "tooltip": "使用默认模板",
            "content": "## 套餐详情\n\n- 流量：{{transfer}} GB\n- 速度限制：{{speed}} Mbps\n- 同时在线设备：{{devices}} 台\n\n## 服务说明\n\n1. 流量{{reset_method}}重置\n2. 支持多平台使用\n3. 7×24小时技术支持"
          }
        },
        "section": {
          "basic": "基本信息",
          "limits": "配额与限制",
          "content": "套餐说明",
          "status": "上架状态"
        },
        "status": {
          "show_desc": "在前台套餐列表中展示",
          "sell_desc": "允许新用户购买此套餐",
          "renew_desc": "允许已有用户续费此套餐"
        },
        "force_update": {
          "label": "强制更新用户套餐",
          "description": "开启后保存时会将该套餐下用户的权限组、流量、限速与设备数强制同步到当前值，仅在编辑已有套餐时生效。"
        },
        "submit": {
          "cancel": "取消",
          "submit": "提交",
          "submitting": "提交中...",
          "success": {
            "add": "套餐添加成功",
            "update": "套餐更新成功"
          },
          "error": {
            "validation": "表单校验失败，请检查并修正错误后重试。"
          }
        }
      },
      "page": {
        "description": "在这里可以配置订阅计划，包括添加、删除、编辑等操作。"
      }
    }
  },
  "settings": {
    "title": "系统设置",
    "description": "管理系统核心配置，包括站点、安全、订阅、邀请佣金、节点、邮件和通知等设置",
    "site": {
      "title": "站点设置",
      "description": "配置站点基本信息，包括站点名称、描述、货币单位等核心设置。",
      "form": {
        "siteName": {
          "label": "站点名称",
          "placeholder": "请输入站点名称",
          "description": "用于显示需要站点名称的地方。"
        },
        "logo": {
          "label": "站点 LOGO",
          "placeholder": "请输入LOGO URL，末尾不要/",
          "description": "用于显示需要LOGO的地方。"
        },
        "siteDescription": {
          "label": "站点描述",
          "placeholder": "请输入站点描述",
          "description": "用于显示需要站点描述的地方。"
        },
        "siteUrl": {
          "label": "站点网址",
          "placeholder": "请输入站点URL，末尾不要/",
          "description": "当前网站最新网址，将会在邮件等需要用于网址处体现。"
        },
        "forceHttps": {
          "label": "强制HTTPS",
          "description": "当站点没有使用HTTPS，CDN或反代开启强制HTTPS时需要开启。"
        },
        "maintenanceMode": {
          "label": "维护模式",
          "description": "开启后普通用户的状态变更和代理流量将暂停，管理员仍可进入后台关闭维护模式。"
        },
        "subscribeUrl": {
          "label": "订阅URL",
          "placeholder": "用于订阅所使用，多个订阅地址用','隔开.留空则为站点URL。",
          "description": "用于订阅所使用，留空则为站点URL。"
        },
        "tosUrl": {
          "label": "用户条款(TOS)URL",
          "placeholder": "请输入用户条款URL，末尾不要/",
          "description": "用于跳转到用户条款(TOS)"
        },
        "stopRegister": {
          "label": "停止新用户注册",
          "description": "开启后任何人都将无法进行注册。"
        },
        "ticketMustWaitReply": {
          "label": "工单等待回复限制",
          "description": "开启后，用户在管理员回复前无法在同一工单内连续发送消息。"
        },
        "tryOut": {
          "label": "注册试用套餐",
          "placeholder": "请选择套餐",
          "description": "选择需要试用的订阅，如果没有选项请先前往订阅管理添加。",
          "no_plan": "关闭",
          "duration": {
            "label": "注册试用时长",
            "placeholder": "0",
            "description": "注册试用时长，单位为小时。"
          }
        },
        "currency": {
          "label": "货币单位",
          "placeholder": "CNY",
          "description": "仅用于展示使用，更改后系统中所有的货币单位都将发生变更。"
        },
        "currencySymbol": {
          "label": "货币符号",
          "placeholder": "¥",
          "description": "仅用于展示使用，更改后系统中所有的货币单位都将发生变更。"
        }
      }
    },
    "safe": {
      "title": "安全设置",
      "description": "配置系统安全相关选项，包括登录验证、密码策略、API访问等安全设置。",
      "form": {
        "emailVerify": {
          "label": "邮箱验证",
          "description": "开启后将会强制要求用户进行邮箱验证。"
        },
        "gmailLimit": {
          "label": "禁止使用Gmail多别名",
          "description": "开启后Gmail多别名将无法注册。"
        },
        "safeMode": {
          "label": "安全模式",
          "description": "开启后除了站点URL以外的绑定本站点的域名访问都将会被403。"
        },
        "securePath": {
          "label": "后台路径",
          "placeholder": "admin",
          "description": "后台管理路径，修改后将会改变原有的admin路径"
        },
        "emailWhitelist": {
          "label": "邮箱后缀白名单",
          "description": "开启后在名单中的邮箱后缀才允许进行注册。",
          "suffixes": {
            "label": "邮箱后缀",
            "placeholder": "输入邮箱后缀，每行一个",
            "description": "输入允许的邮箱后缀，每行一个"
          }
        },
        "captcha": {
          "enable": {
            "label": "启用验证码",
            "description": "开启后用户注册时需要通过验证码验证。"
          },
          "type": {
            "label": "验证码类型",
            "description": "选择要使用的验证码服务类型",
            "options": {
              "recaptcha": "Google reCAPTCHA v2",
              "recaptcha-v3": "Google reCAPTCHA v3",
              "turnstile": "Cloudflare Turnstile"
            }
          },
          "recaptcha": {
            "key": {
              "label": "reCAPTCHA密钥",
              "placeholder": "输入reCAPTCHA密钥",
              "description": "输入您的reCAPTCHA密钥"
            },
            "siteKey": {
              "label": "reCAPTCHA站点密钥",
              "placeholder": "输入reCAPTCHA站点密钥",
              "description": "输入您的reCAPTCHA站点密钥"
            }
          },
          "recaptcha_v3": {
            "secretKey": {
              "label": "reCAPTCHA v3密钥",
              "placeholder": "输入reCAPTCHA v3密钥",
              "description": "输入您的reCAPTCHA v3服务器密钥"
            },
            "siteKey": {
              "label": "reCAPTCHA v3站点密钥",
              "placeholder": "输入reCAPTCHA v3站点密钥",
              "description": "输入您的reCAPTCHA v3站点密钥"
            },
            "scoreThreshold": {
              "label": "分数阈值",
              "placeholder": "0.5",
              "description": "设置验证分数阈值（0-1），分数越高表示越可能是真人操作"
            }
          },
          "turnstile": {
            "secretKey": {
              "label": "Turnstile密钥",
              "placeholder": "输入Turnstile密钥",
              "description": "输入您的Cloudflare Turnstile密钥"
            },
            "siteKey": {
              "label": "Turnstile站点密钥",
              "placeholder": "输入Turnstile站点密钥",
              "description": "输入您的Cloudflare Turnstile站点密钥"
            }
          }
        },
        "registerLimit": {
          "enable": {
            "label": "IP注册限制",
            "description": "开启后将限制同一IP的注册次数。"
          },
          "count": {
            "label": "注册次数",
            "placeholder": "输入最大注册次数",
            "description": "同一IP允许的最大注册次数"
          },
          "expire": {
            "label": "限制时长",
            "placeholder": "输入限制时长（分钟）",
            "description": "注册限制的持续时间（分钟）"
          }
        },
        "passwordLimit": {
          "enable": {
            "label": "密码尝试限制",
            "description": "开启后将限制密码尝试次数。"
          },
          "count": {
            "label": "尝试次数",
            "placeholder": "输入最大尝试次数",
            "description": "允许的最大密码尝试次数"
          },
          "expire": {
            "label": "锁定时长",
            "placeholder": "输入锁定时长（分钟）",
            "description": "账户锁定的持续时间（分钟）"
          }
        }
      }
    },
    "subscribe": {
      "title": "订阅设置",
      "description": "管理用户订阅相关配置，包括订阅链接格式、更新频率、流量统计等设置。",
      "plan_change_enable": {
        "title": "允许用户更改订阅",
        "description": "开启后用户将会可以对订阅计划进行变更。"
      },
      "reset_traffic_method": {
        "title": "月流量重置方式",
        "description": "全局流量重置方式，默认每月1号。可以在订阅管理为订阅单独设置。",
        "options": {
          "monthly_first": "每月1号",
          "monthly_reset": "按月重置",
          "no_reset": "不重置",
          "yearly_first": "每年1月1号",
          "yearly_reset": "按年重置"
        }
      },
      "surplus_enable": {
        "title": "开启折抵方案",
        "description": "开启后用户更换订阅将会由系统对原有订阅进行折抵，方案参考文档。"
      },
      "new_order_event": {
        "title": "当订阅新购时触发事件",
        "description": "新购订阅完成时将触发该任务。",
        "options": {
          "no_action": "不执行任何动作",
          "reset_traffic": "重置用户流量"
        }
      },
      "renew_order_event": {
        "title": "当订阅续费时触发事件",
        "description": "续费订阅完成时将触发该任务。",
        "options": {
          "no_action": "不执行任何动作",
          "reset_traffic": "重置用户流量"
        }
      },
      "change_order_event": {
        "title": "当订阅变更时触发事件",
        "description": "变更订阅完成时将触发该任务。",
        "options": {
          "no_action": "不执行任何动作",
          "reset_traffic": "重置用户流量"
        }
      },
      "subscribe_path": {
        "title": "订阅路径",
        "description": "订阅路径，修改后将会改变原有的subscribe路径",
        "current_format": "当前订阅路径格式：{path}/xxxxxxxxxx",
        "restart_tip": "修改订阅路径后，可能需要重启服务才能生效。"
      },
      "show_info_to_server": {
        "title": "在订阅中展示订阅信息",
        "description": "开启后将会在用户订阅节点时输出订阅信息。"
      },
      "show_protocol_to_server": {
        "title": "在订阅中线路名称中显示协议名称",
        "description": "开启后订阅线路会附带协议名称（例如: [Hy2]香港）"
      },
      "default_remind_expire": {
        "title": "新用户默认开启到期提醒",
        "description": "开启后新注册用户默认启用订阅到期提醒，可在用户管理单独调整。"
      },
      "default_remind_traffic": {
        "title": "新用户默认开启流量提醒",
        "description": "开启后新注册用户默认启用流量不足提醒，可在用户管理单独调整。"
      },
      "deposit_enable": {
        "title": "开启余额充值",
        "description": "开启后用户可在前台创建余额充值订单并完成支付入账。"
      },
      "deposit_commission_enable": {
        "title": "余额充值参与邀请返佣",
        "description": "开启后余额充值订单将按邀请规则计算佣金。"
      },
      "deposit_min_amount": {
        "title": "最低充值金额（分）",
        "description": "用户单笔充值的最低金额，单位为分。例如 100 表示 1 元。",
        "placeholder": "100"
      },
      "deposit_max_amount": {
        "title": "最高充值金额（分）",
        "description": "用户单笔充值的最高金额，单位为分。",
        "placeholder": "999999900"
      },
      "deposit_bonus": {
        "title": "充值赠送阶梯",
        "description": "格式为「门槛元:赠送元」，例如 100:10 表示充值满 100 元赠送 10 元。取满足门槛的最大赠送。",
        "placeholder": "100:10"
      },
      "saving": "保存中...",
      "plan": {
        "title": "订阅套餐",
        "add": "添加套餐",
        "search": "搜索套餐...",
        "sort": {
          "edit": "编辑排序",
          "save": "保存排序"
        },
        "columns": {
          "id": "编号",
          "show": "显示",
          "sell": "新购",
          "renew": "续费",
          "renew_tooltip": "在订阅停止销售时，已购用户是否可以续费",
          "name": "名称",
          "stats": "统计",
          "group": "权限组",
          "price": "价格",
          "actions": "操作",
          "edit": "编辑",
          "delete": "删除",
          "delete_confirm": {
            "title": "确认删除",
            "description": "此操作将永久删除该订阅，删除后无法恢复。确定要继续吗？",
            "success": "删除成功"
          },
          "price_period": {
            "hourly": "时付",
            "daily": "日付",
            "monthly": "月付",
            "quarterly": "季付",
            "half_yearly": "半年付",
            "yearly": "年付",
            "two_yearly": "两年付",
            "three_yearly": "三年付",
            "onetime": "流量包",
            "reset_traffic": "重置包",
            "unit": {
              "hour": "元/时",
              "day": "元/天",
              "month": "元/月",
              "quarter": "元/季",
              "half_year": "元/半年",
              "year": "元/年",
              "two_year": "元/两年",
              "three_year": "元/三年",
              "times": "元/次"
            }
          }
        },
        "form": {
          "add_title": "添加套餐",
          "edit_title": "编辑套餐",
          "name": {
            "label": "套餐名称",
            "placeholder": "请输入套餐名称"
          },
          "group": {
            "label": "权限组",
            "placeholder": "选择权限组",
            "add": "添加权限组",
            "none": "不绑定权限组"
          },
          "transfer": {
            "label": "流量",
            "placeholder": "请输入流量大小",
            "unit": "GB"
          },
          "speed": {
            "label": "限速",
            "placeholder": "请输入限速",
            "unit": "Mbps"
          },
          "price": {
            "title": "售价设置",
            "base_price": "基础月付价格",
            "clear": {
              "button": "清空价格",
              "tooltip": "清空所有周期的价格设置"
            }
          },
          "device": {
            "label": "设备限制",
            "placeholder": "留空则不限制",
            "unit": "台"
          },
          "capacity": {
            "label": "容量限制",
            "placeholder": "留空则不限制",
            "unit": "人"
          },
          "reset_method": {
            "label": "流量重置方式",
            "placeholder": "选择流量重置方式",
            "description": "设置订阅流量的重置方式，不同的重置方式会影响用户的流量计算方式",
            "options": {
              "follow_system": "跟随系统设置",
              "monthly_first": "每月1号",
              "monthly_reset": "按月重置",
              "no_reset": "不重置",
              "yearly_first": "每年1月1日",
              "yearly_reset": "按年重置"
            }
          },
          "content": {
            "label": "套餐描述",
            "placeholder": "在这里编写套餐描述...",
            "description": "支持 Markdown 格式，可以使用标题、列表、粗体、斜体等样式来美化描述内容",
            "preview": "预览",
            "preview_button": {
              "show": "显示预览",
              "hide": "隐藏预览"
            },
            "template": {
              "button": "使用模板",
              "tooltip": "点击使用预设的套餐描述模板",
              "content": "## 套餐特点\n• 高速稳定的全球网络接入\n• 支持多设备同时在线\n• 无限制的流量重置\n\n## 使用说明\n1. 支持设备：iOS、Android、Windows、macOS\n2. 24/7 技术支持\n3. 自动定期流量重置\n\n## 注意事项\n- 禁止滥用\n- 遵守当地法律法规\n- 支持随时更换套餐"
            }
          },
          "force_update": {
            "label": "强制更新到用户",
            "description": "开启后保存时将该套餐下用户的权限组、流量、限速与设备数强制同步到当前值。"
          },
          "submit": {
            "submitting": "提交中...",
            "submit": "提交",
            "cancel": "取消",
            "success": {
              "add": "套餐添加成功",
              "update": "套餐更新成功"
            }
          }
        },
        "page": {
          "description": "在这里可以配置订阅计划，包括添加、删除、编辑等操作。"
        }
      }
    },
    "email": {
      "title": "邮件设置",
      "description": "配置系统邮件服务，用于发送验证码、密码重置、通知等邮件，支持多种SMTP服务商。",
      "tab_settings": "基本设置",
      "tab_templates": "模板管理",
      "email_host": {
        "title": "SMTP主机",
        "description": "SMTP服务器地址，例如：smtp.gmail.com",
        "placeholder": "smtp.example.com"
      },
      "email_port": {
        "title": "SMTP端口",
        "description": "SMTP服务器端口，常用端口：25, 465, 587",
        "placeholder": "465"
      },
      "email_username": {
        "title": "SMTP用户名",
        "description": "SMTP认证用户名",
        "placeholder": "user@example.com"
      },
      "email_password": {
        "title": "SMTP密码",
        "description": "SMTP认证密码或应用专用密码",
        "placeholder": "请输入密码或应用专用密码"
      },
      "email_encryption": {
        "title": "加密方式",
        "description": "邮件加密方式",
        "placeholder": "选择加密方式",
        "none": "无",
        "ssl": "SSL/TLS",
        "tls": "STARTTLS"
      },
      "email_from_address": {
        "title": "发件人地址",
        "description": "发件人邮箱地址",
        "placeholder": "noreply@example.com"
      },
      "email_from_name": {
        "title": "发件人名称",
        "description": "发件人显示名称"
      },
      "email_template": {
        "title": "邮件模板",
        "description": "自定义邮件模板方式请查看文档",
        "placeholder": "选择邮件模板"
      },
      "remind_mail_enable": {
        "title": "邮件提醒",
        "description": "开启后用户订阅即将到期或流量不足时会收到邮件通知。"
      },
      "test": {
        "title": "发送测试邮件",
        "sending": "发送中...",
        "description": "发送测试邮件以验证配置",
        "success": "测试邮件发送成功",
        "error": "测试邮件发送失败",
        "label_to": "收件人",
        "label_subject": "主题",
        "placeholder_to": "user@example.com",
        "placeholder_subject": "测试邮件主题"
      }
    },
    "telegram": {
      "title": "Telegram设置",
      "description": "配置Telegram机器人功能，实现用户通知、账户绑定、指令交互等自动化服务。",
      "bot_token": {
        "title": "机器人令牌",
        "description": "请输入从Botfather获取的令牌。",
        "placeholder": "0000000000:xxxxxxxxx_xxxxxxxxxxxxxxx"
      },
      "webhook_url": {
        "title": "Webhook 基础地址",
        "description": "这里只填写基础地址，系统会自动拼接 Telegram 的完整 Webhook 回调路径。留空时默认使用站点网址。",
        "docs": "查看 Telegram Webhook 文档",
        "placeholder": "https://example.com"
      },
      "webhook": {
        "title": "设置Webhook",
        "description": "设置机器人的webhook，不设置将无法收到Telegram通知。",
        "button": "一键设置",
        "setting": "设置中...",
        "success": "Webhook 设置成功",
        "error": "Webhook 设置失败",
        "target_default": "当前将使用站点网址作为 Webhook Base URL。",
        "target_custom": "当前将使用自定义 Webhook Base URL：{{url}}",
        "debug": {
          "title": "Webhook 调试信息",
          "success": "成功状态",
          "url": "Webhook 地址",
          "baseUrl": "基础地址"
        }
      },
      "bot_enable": {
        "title": "启用Telegram绑定引导",
        "description": "开启后将在用户端显示Telegram绑定引导，帮助用户绑定Telegram账户以接收通知。"
      },
      "discuss_link": {
        "title": "群组链接",
        "description": "填写后将在用户端显示或在需要的地方使用。",
        "placeholder": "https://t.me/xxxxxx"
      }
    },
    "app": {
      "title": "APP设置",
      "description": "管理移动应用程序相关配置，包括API接口、版本控制、推送通知等功能设置。",
      "common": {
        "placeholder": "请输入"
      },
      "windows": {
        "version": {
          "title": "Windows版本",
          "description": "Windows客户端当前版本号"
        },
        "download": {
          "title": "Windows下载地址",
          "description": "Windows客户端下载链接"
        }
      },
      "macos": {
        "version": {
          "title": "macOS版本",
          "description": "macOS客户端当前版本号"
        },
        "download": {
          "title": "macOS下载地址",
          "description": "macOS客户端下载链接"
        }
      },
      "android": {
        "version": {
          "title": "Android版本",
          "description": "Android客户端当前版本号"
        },
        "download": {
          "title": "Android下载地址",
          "description": "Android客户端下载链接"
        }
      }
    },
    "common": {
      "saving": "保存中...",
      "save": "保存",
      "save_success": "保存成功",
      "save_error": "保存失败",
      "reset": "重置",
      "placeholder": "请输入",
      "autoSaved": "已自动保存",
      "saved_at": "{{seconds}} 秒前已保存",
      "invalidJson": "JSON 格式错误"
    },
    "invite": {
      "title": "邀请&佣金设置",
      "description": "邀请注册、佣金相关设置。",
      "invite_force": {
        "title": "开启强制邀请",
        "description": "开启后只有被邀请的用户才可以进行注册。"
      },
      "invite_commission": {
        "title": "邀请佣金百分比",
        "description": "默认全局的佣金分配比例，你可以在用户管理单独配置单个比例。",
        "placeholder": "请输入佣金百分比"
      },
      "invite_gen_limit": {
        "title": "用户可创建邀请码上限",
        "description": "用户可创建邀请码上限",
        "placeholder": "请输入创建上限"
      },
      "invite_never_expire": {
        "title": "邀请码永不失效",
        "description": "开启后邀请码被使用后将不会失效，否则使用过后即失效。"
      },
      "commission_first_time": {
        "title": "佣金仅首次发放",
        "description": "开启后被邀请人首次支付时才会产生佣金，可以在用户管理对用户进行单独配置。"
      },
      "commission_auto_check": {
        "title": "佣金自动确认",
        "description": "开启后佣金将会在订单完成3日后自动进行确认。"
      },
      "commission_withdraw_limit": {
        "title": "提现单申请门槛(元)",
        "description": "小于门槛金额的提现单将不会被提交。",
        "placeholder": "请输入提现门槛"
      },
      "commission_withdraw_method": {
        "title": "提现方式",
        "description": "可以支持的提现方式，多个用逗号分隔。",
        "placeholder": "请输入提现方式，多个用逗号分隔"
      },
      "withdraw_close": {
        "title": "关闭提现",
        "description": "关闭后将禁止用户申请提现，且邀请佣金将会直接进入用户余额。"
      },
      "commission_distribution": {
        "title": "三级分销",
        "description": "开启后将佣金将按照设置的3成比例进行分成，三成比例合计请不要大于100%。",
        "l1": "一级邀请人比例",
        "l2": "二级邀请人比例",
        "l3": "三级邀请人比例",
        "placeholder": "请输入比例，如：50"
      },
      "distribution_total": "当前分销比例合计：{{total}}%（不应超过 100%）",
      "saving": "保存中..."
    },
    "server": {
      "title": "节点配置",
      "description": "配置节点通信和同步设置，包括通信密钥、轮询间隔、负载均衡等高级选项。",
      "server_token": {
        "title": "通讯密钥",
        "description": "Fboard与节点通讯的密钥，以便数据不会被他人获取。",
        "placeholder": "请输入通讯密钥",
        "generate_tooltip": "点击生成随机通信密钥"
      },
      "server_pull_interval": {
        "title": "节点拉取动作轮询间隔",
        "description": "节点从面板获取数据的间隔频率。",
        "placeholder": "请输入拉取间隔"
      },
      "server_push_interval": {
        "title": "节点推送动作轮询间隔",
        "description": "节点推送数据到面板的间隔频率。",
        "placeholder": "请输入推送间隔"
      },
      "device_limit_mode": {
        "title": "设备限制模式",
        "description": "宽松模式下，同一IP地址使用多个节点只统计为一个设备。",
        "strict": "严格模式",
        "relaxed": "宽松模式",
        "placeholder": "请选择设备限制模式"
      },
      "server_ws_enable": {
        "title": "启用 WebSocket 通信",
        "description": "开启后节点将通过 WebSocket 与面板进行实时通信，延迟更低、推送更及时。",
        "supported_clients": "目前支持 WebSocket 通信的节点端：Fboard-Node"
      },
      "server_ws_url": {
        "title": "WebSocket 地址",
        "description": "节点连接面板的 WebSocket 地址，留空则自动使用站点网址。",
        "placeholder": "留空则使用站点网址"
      },
      "server_ws_log_enable": {
        "title": "WebSocket 调试日志",
        "description": "开启后记录节点/机器连接、全量同步、推送等 [WS] 日志。默认关闭，避免节点较多时刷屏；异常告警始终会写入。修改后数秒内生效，无需重启。"
      },
      "node_install_script_url": {
        "title": "节点安装脚本地址",
        "description": "自定义节点安装脚本的 URL 地址，留空则使用默认的 GitHub 地址。",
        "placeholder": "留空则使用默认地址"
      },
      "utls_fingerprints": {
        "title": "uTLS 指纹列表",
        "description": "编辑节点时「uTLS 设置 → 指纹」的具体指纹可选项。支持 chrome / firefox / safari / ios / android / edge / qq 等，也可添加客户端支持的其它指纹名。random（订阅时随机）与 randomized（客户端内随机）由系统固定提供，无需在此配置。",
        "placeholder": "输入指纹名称后回车添加，如 chrome"
      },
      "saving": "保存中...",
      "manage": {
        "title": "节点管理",
        "description": "管理所有节点，包括添加、删除、编辑等操作。"
      }
    },
    "subscribe_template": {
      "title": "订阅模板",
      "description": "配置各个客户端的订阅模板（按需加载，需手动保存）",
      "unsaved_hint": "当前模板有未保存的修改，请点击保存。",
      "singbox": {
        "title": "Sing-box 订阅模板",
        "description": "配置 Sing-box 的订阅模板格式"
      },
      "clash": {
        "title": "Clash 订阅模板",
        "description": "配置 Clash 的订阅模板格式"
      },
      "clashmeta": {
        "title": "Clash Meta 订阅模板",
        "description": "配置 Clash Meta 的订阅模板格式"
      },
      "stash": {
        "title": "Stash 订阅模板",
        "description": "配置 Stash 的订阅模板格式"
      },
      "surge": {
        "title": "Surge 配置模板",
        "description": "配置 Surge 订阅模板，支持 Surge 配置文件格式"
      },
      "surfboard": {
        "title": "Surfboard 配置模版",
        "description": "配额 Surfboard 订阅模版"
      }
    },
    "email_template": {
      "title": "邮件模板",
      "description": "自定义系统发送的各类邮件内容模板",
      "customized": "已自定义",
      "subject": "邮件主题",
      "subject_placeholder": "输入邮件主题，支持 {{name}} 等占位符",
      "content": "模板内容 (HTML)",
      "preview": "实时预览",
      "override_hint": "修改并保存后将覆盖系统默认模板。点击「恢复默认」可随时还原为当前主题的默认模板。",
      "placeholders": "可用占位符",
      "var_name": "变量",
      "var_desc": "说明",
      "var_sample": "示例值",
      "required": "必填",
      "insert": "插入",
      "placeholder_hint": "* 标记为必须包含的占位符，点击可插入到内容末尾",
      "click_to_insert": "点击插入",
      "save": "保存",
      "save_success": "模板保存成功",
      "save_before_test": "请先保存修改后再发送测试",
      "send_test": "发送测试",
      "test_dialog_title": "发送测试邮件",
      "test_dialog_description": "输入收件邮箱，留空将发送到当前管理员邮箱",
      "test_email_placeholder": "收件邮箱（留空使用当前账号）",
      "sending": "发送中...",
      "test_success": "测试邮件已发送",
      "reset": "恢复默认",
      "reset_title": "恢复默认模板",
      "reset_description": "确定要恢复此模板为默认内容吗？自定义的内容将被删除。",
      "reset_confirm": "确定恢复",
      "reset_success": "已恢复默认模板",
      "unsaved": "有未保存的修改",
      "discard_title": "未保存的修改",
      "discard_description": "当前模板有未保存的修改，切换标签页将丢失这些修改。",
      "discard_confirm": "丢弃修改",
      "cancel": "取消"
    }
  },
  "notice": {
    "title": "公告管理",
    "description": "在这里可以配置公告，包括添加、删除、编辑等操作。",
    "table": {
      "columns": {
        "id": "ID",
        "show": "显示状态",
        "title": "标题",
        "actions": "操作"
      },
      "toolbar": {
        "search": "搜索公告标题...",
        "reset": "重置",
        "sort": {
          "edit": "编辑排序",
          "save": "保存排序"
        }
      },
      "actions": {
        "edit": "编辑",
        "delete": {
          "title": "删除确认",
          "description": "确定要删除该条公告吗？此操作无法撤销。",
          "success": "删除成功"
        }
      }
    },
    "form": {
      "add": {
        "title": "添加公告",
        "button": "添加公告"
      },
      "edit": {
        "title": "编辑公告"
      },
      "fields": {
        "title": {
          "label": "标题",
          "placeholder": "请输入公告标题"
        },
        "content": {
          "label": "公告内容"
        },
        "img_url": {
          "label": "公告背景",
          "placeholder": "请输入公告背景图片URL"
        },
        "show": {
          "label": "显示"
        },
        "tags": {
          "label": "节点标签",
          "placeholder": "输入后回车添加标签"
        }
      },
      "buttons": {
        "cancel": "取消",
        "submit": "提交",
        "success": "提交成功"
      }
    },
    "messages": {
      "loadError": "加载公告失败"
    }
  },
  "group": {
    "title": "权限组管理",
    "description": "管理所有权限组，包括添加、删除、编辑等操作。",
    "columns": {
      "id": "组ID",
      "name": "组名称",
      "usersCount": "用户数量",
      "serverCount": "节点数量",
      "actions": "操作"
    },
    "form": {
      "add": "添加权限组",
      "edit": "编辑权限组",
      "create": "创建权限组",
      "update": "更新",
      "name": "组名称",
      "namePlaceholder": "请输入权限组名称",
      "nameDescription": "权限组名称用于标识不同的用户组，建议使用有意义的名称。",
      "cancel": "取消",
      "editDescription": "修改权限组信息，更新后会立即生效。",
      "createDescription": "创建新的权限组，可以为不同的用户分配不同的权限。"
    },
    "toolbar": {
      "searchPlaceholder": "搜索权限组...",
      "reset": "重置"
    },
    "messages": {
      "deleteConfirm": "确认删除",
      "deleteDescription": "此操作将永久删除该权限组，删除后无法恢复。确定要继续吗？",
      "deleteButton": "删除",
      "createSuccess": "创建成功",
      "updateSuccess": "更新成功",
      "nameValidation": {
        "min": "组名至少需要2个字符",
        "max": "组名不能超过50个字符",
        "pattern": "组名只能包含字母、数字、中文、下划线和连字符"
      }
    }
  },
  "auth": {
    "signIn": {
      "title": "登录",
      "description": "请输入您的邮箱和密码登录系统",
      "email": "邮箱地址",
      "emailPlaceholder": "name@example.com",
      "password": "密码",
      "passwordPlaceholder": "请输入密码",
      "forgotPassword": "忘记密码？",
      "submit": "登录",
      "rememberMe": "记住我",
      "resetPassword": {
        "title": "重置密码",
        "description": "在站点目录下执行以下命令找回密码",
        "command": "php artisan reset:password 管理员邮箱"
      },
      "validation": {
        "emailRequired": "请输入邮箱地址",
        "emailInvalid": "邮箱地址格式不正确",
        "passwordRequired": "请输入密码",
        "passwordLength": "密码长度至少为7个字符"
      }
    }
  },
  "traffic": {
    "trafficRecord": {
      "title": "流量使用记录",
      "time": "时间",
      "upload": "上行流量",
      "download": "下行流量",
      "rate": "倍率",
      "total": "总计",
      "noRecords": "暂无记录",
      "perPage": "每页显示",
      "records": "条记录",
      "page": "第 {{current}} / {{total}} 页",
      "multiplier": "{{value}}x"
    }
  },
  "payment": {
    "title": "支付配置",
    "description": "在这里可以配置支付方式，包括支付宝、微信等。",
    "table": {
      "columns": {
        "id": "ID",
        "enable": "启用",
        "name": "显示名称",
        "payment": "支付接口",
        "notify_url": "通知地址",
        "notify_url_tooltip": "支付网关将会把数据通知到本地址，请通过防火墙放行本地址。",
        "actions": "操作"
      },
      "actions": {
        "edit": "编辑",
        "copy": "复制",
        "copy_success": "复制成功",
        "delete": {
          "title": "删除确认",
          "description": "确定要删除该支付方式吗？此操作无法撤销。",
          "success": "删除成功"
        }
      },
      "toolbar": {
        "search": "搜索支付方式...",
        "reset": "重置",
        "sort": {
          "hint": "拖拽支付方式进行排序，完成后点击保存",
          "save": "保存排序",
          "edit": "编辑排序"
        }
      }
    },
    "form": {
      "add": {
        "button": "添加支付方式",
        "title": "添加支付方式"
      },
      "edit": {
        "title": "编辑支付方式"
      },
      "fields": {
        "name": {
          "label": "显示名称",
          "placeholder": "请输入支付名称",
          "description": "用于前端显示"
        },
        "icon": {
          "label": "图标URL",
          "placeholder": "https://example.com/icon.svg",
          "description": "用于前端显示的图标地址"
        },
        "notify_domain": {
          "label": "通知域名",
          "placeholder": "https://example.com",
          "description": "网关通知将发送到该域名"
        },
        "handling_fee_percent": {
          "label": "百分比手续费(%)",
          "placeholder": "0-100"
        },
        "handling_fee_fixed": {
          "label": "固定手续费",
          "placeholder": "0"
        },
        "payment": {
          "label": "支付接口",
          "placeholder": "请选择支付接口",
          "description": "选择要使用的支付接口"
        }
      },
      "validation": {
        "name": {
          "min": "名称至少需要2个字符",
          "max": "名称不能超过30个字符"
        },
        "notify_domain": {
          "url": "请输入有效的URL"
        },
        "payment": {
          "required": "请选择支付接口"
        }
      },
      "buttons": {
        "cancel": "取消",
        "submit": "提交"
      },
      "sections": {
        "payment_config": "支付配置"
      },
      "messages": {
        "success": "保存成功"
      },
      "config": {
        "title": "支付配置",
        "noConfig": "该支付方式暂无配置项"
      }
    }
  },
  "server": {
    "manage": {
      "title": "节点管理",
      "description": "管理所有节点，包括添加、删除、编辑等操作。",
      "filtered_by_server": "当前正在查看服务器 {{server}} (SID:{{id}}) 下的节点",
      "filtered_by_server_description": "在这里新增节点时，可以直接复用当前服务器作为部署目标。",
      "add_node_to_server": "新增节点到此服务器",
      "clear_server_filter": "清除服务器筛选"
    },
    "columns": {
      "sort": "排序",
      "nodeId": "节点ID",
      "show": "显隐",
      "node": "节点",
      "address": "地址",
      "onlineUsers": {
        "title": "在线人数",
        "tooltip": "在线人数根据服务端上报频率而定",
        "sort_tip": "按在线人数排序"
      },
      "rate": {
        "title": "倍率",
        "tooltip": "流量扣费倍率"
      },
      "traffic": {
        "title": "流量使用",
        "tooltip": "节点流量使用情况，显示已用流量和限制",
        "total": "总流量",
        "used": "已用",
        "percentage": "使用率"
      },
      "groups": {
        "title": "权限组",
        "tooltip": "可订阅到该节点的权限组",
        "empty": "--"
      },
      "loadStatus": {
        "title": "负载状态",
        "tooltip": "服务器资源使用情况",
        "noData": "暂无数据",
        "details": "系统负载详情",
        "cpu": "CPU 使用率",
        "memory": "内存使用",
        "swap": "交换区",
        "disk": "磁盘使用",
        "lastUpdate": "最后更新",
        "metrics": {
          "title": "运行指标",
          "uptime": "运行时长",
          "conns": "实时/总连接",
          "speed": "实时速率",
          "api": "API 状态",
          "kernel": "内核状态",
          "gc": "GC 暂停",
          "limit": "限速用户",
          "ws": "WebSocket",
          "goroutines": "并发协程",
          "load": "系统负载",
          "users": "在线用户"
        }
      },
      "version": "版本",
      "customId": "自定义ID",
      "originalId": "原始ID",
      "type": "类型",
      "actions": "操作",
      "copyAddress": "复制连接地址",
      "internalPort": "内部端口",
      "deployment": {
        "title": "部署方式",
        "tooltip": "查看节点是独立部署，还是由某台服务器托管，并可直接在列表中调整。",
        "standalone": "独立部署",
        "standalone_row_hint": "未绑定服务器",
        "standalone_description": "该节点不依赖服务器托管，适用于单节点独立部署。",
        "online": "在线",
        "offline": "离线",
        "inactive": "服务器未激活",
        "disabled": "节点停用",
        "enabled": "在服务器上启用",
        "enabled_description": "仅已启用的节点会由所选服务器拉起并同步。",
        "enabled_standalone_description": "独立部署节点无需设置服务器启用状态。",
        "bind_success": "已托管到 {{server}}",
        "standalone_success": "已切换为独立部署",
        "update_success": "部署状态已更新",
        "update_error": "部署状态更新失败"
      },
      "status": {
        "0": "未运行",
        "1": "无人使用或异常",
        "2": "运行正常"
      },
      "childNode": "子节点",
      "actions_dropdown": {
        "edit": "编辑",
        "copy": "复制",
        "reset_traffic": {
          "title": "确认重置流量",
          "description": "此操作将清零该节点的上传和下载流量，并解除禁用状态。确定要继续吗？",
          "confirm": "重置流量"
        },
        "reset_traffic_success": "流量重置成功",
        "delete": {
          "title": "确认删除",
          "description": "此操作将永久删除该节点，删除后无法恢复。确定要继续吗？",
          "confirm": "删除"
        },
        "copy_success": "复制成功",
        "delete_success": "删除成功"
      }
    },
    "toolbar": {
      "search": "搜索节点...",
      "type": "类型",
      "status": "运行状态",
      "server": "服务器",
      "server_search": "搜索服务器...",
      "server_empty": "未找到服务器",
      "reset": "重置",
      "actions": "操作",
      "sort": {
        "tip": "拖拽节点进行排序，完成后点击保存",
        "edit": "编辑排序",
        "save": "保存排序",
        "success": "排序保存成功"
      },
      "batch_delete": {
        "menu": "删除节点",
        "button": "删除 {{count}} 项",
        "title": "确认批量删除",
        "description": "确定要删除选中的 {{count}} 个节点吗？此操作不可恢复。",
        "confirm": "确认删除"
      },
      "batch_delete_success": "成功删除 {{count}} 个节点",
      "batch_delete_error": "批量删除失败",
      "batch_show": {
        "menu": "显示节点"
      },
      "batch_show_success": "成功显示 {{count}} 个节点",
      "batch_show_error": "批量显示失败",
      "batch_hide": {
        "menu": "隐藏节点"
      },
      "batch_hide_success": "成功隐藏 {{count}} 个节点",
      "batch_hide_error": "批量隐藏失败",
      "batch_enable": {
        "menu": "启用节点"
      },
      "batch_enable_success": "成功启用 {{count}} 个节点",
      "batch_enable_error": "批量启用失败",
      "batch_disable": {
        "menu": "禁用节点"
      },
      "batch_disable_success": "成功禁用 {{count}} 个节点",
      "batch_disable_error": "批量禁用失败",
      "batch_reset_traffic": {
        "menu": "重置流量",
        "button": "重置 {{count}} 项流量",
        "title": "确认批量重置流量",
        "description": "确定要重置选中的 {{count}} 个节点的流量吗？此操作将清零流量并解除禁用状态。",
        "confirm": "确认重置"
      },
      "batch_reset_traffic_success": "成功重置 {{count}} 个节点的流量",
      "batch_reset_traffic_error": "批量重置流量失败",
      "batch_replace": {
        "selected": "已选择 {{count}} 个节点",
        "menu": "批量替换",
        "clear": "清除选择",
        "title": "批量替换节点字段",
        "field": "字段",
        "search": "搜索值",
        "search_placeholder": "输入要搜索的字符串",
        "replace": "替换值",
        "replace_placeholder": "输入要替换成的字符串",
        "confirm": "替换",
        "search_required": "请输入搜索值",
        "success": "成功替换 {{count}} 个节点",
        "fields": {
          "name": "节点名称",
          "host": "主机地址",
          "port": "端口",
          "code": "节点标识",
          "group_ids": "权限组",
          "route_ids": "路由规则",
          "tags": "标签",
          "protocol_settings": "协议设置",
          "custom_outbounds": "自定义出站",
          "custom_routes": "自定义路由",
          "cert_config": "证书配置",
          "rate_time_ranges": "倍率时间段"
        }
      },
      "filteringByMachine": "正在筛选该机器的节点：",
      "virtualNode": "虚拟节点"
    },
    "form": {
      "add_node": "添加节点",
      "edit_node": "编辑节点",
      "new_node": "新建节点",
      "type": {
        "placeholder": "选择协议类型",
        "select_prompt": "请先选择协议类型",
        "select_error": "请先选择协议类型",
        "configHint": "选择协议类型后可配置"
      },
      "name": {
        "label": "节点名称",
        "placeholder": "请输入节点名称",
        "error": "请输入有效的节点名称"
      },
      "rate": {
        "label": "基础倍率",
        "hint": "流量计费倍率，1 表示按实际流量计费",
        "error": "基础倍率不能为空",
        "error_numeric": "基础倍率必须是数字",
        "error_gte_zero": "基础倍率必须大于或等于0",
        "child_node_tooltip": "子节点的基础倍率继承自父节点，无法单独设置",
        "child_node_note": "子节点倍率继承自父节点"
      },
      "traffic_limit": {
        "label": "流量限制",
        "placeholder": "0 表示不限制",
        "hint": "设置节点流量上限（单位：GB），0 表示不限制",
        "error_numeric": "流量限制必须是数字",
        "error_gte_zero": "流量限制必须大于或等于0"
      },
      "protocolSection": "协议配置",
      "traffic_limit_unit": "GB, 0=不限制",
      "banned": {
        "label": "禁用节点",
        "description": "禁用后节点将不可用"
      },
      "dynamic_rate": {
        "section_title": "动态倍率配置",
        "enable_label": "启用动态倍率",
        "enable_description": "根据时间段设置不同的倍率乘数",
        "rules_label": "时间段规则",
        "add_rule": "添加规则",
        "rule_title": "规则 {{index}}",
        "start_time": "开始时间",
        "end_time": "结束时间",
        "multiplier": "倍率乘数",
        "no_rules": "暂无规则，点击上方按钮添加",
        "start_time_error": "开始时间不能为空",
        "end_time_error": "结束时间不能为空",
        "multiplier_error": "倍率乘数不能为空",
        "multiplier_error_numeric": "倍率乘数必须是数字",
        "multiplier_error_gte_zero": "倍率乘数必须大于或等于0"
      },
      "required_mark": "必填",
      "optional_mark": "选填",
      "required_fields_hint": "带 * 的为必填项，提交前请完整填写",
      "code": {
        "label": "自定义节点ID",
        "optional": "(选填)",
        "placeholder": "请输入自定义节点ID",
        "hint": "选填；用于外部系统对照，不影响协议连接"
      },
      "tags": {
        "label": "节点标签",
        "optional": "(选填)",
        "placeholder": "输入后按逗号/回车添加",
        "hint": "选填；展示在用户端节点名称旁"
      },
      "groups": {
        "label": "权限组",
        "add": "添加权限组",
        "placeholder": "请选择权限组",
        "empty": "未找到结果",
        "hint": "选填；不选则任何权限组用户都看不到此节点（取决于业务逻辑，建议至少选一个）"
      },
      "routes": {
        "label": "路由规则",
        "empty": "未找到路由规则",
        "hint": "选填；绑定的路由规则会下发到使用该节点的客户端订阅配置中"
      },
      "machine": {
        "label": "绑定服务器",
        "placeholder": "选择服务器（可选）",
        "none": "独立部署",
        "enabled_hint": "选择是否由此服务器管理该节点",
        "hint": "选填；绑定后由该服务器上的 Fboard-Node 托管此节点"
      },
      "host": {
        "label": "节点地址",
        "placeholder": "请输入节点域名或者IP",
        "error": "节点地址不能为空"
      },
      "port": {
        "label": "连接端口",
        "placeholder": "443 或 10000-11000",
        "tooltip": "用户实际连接使用的端口。支持单端口（如 443）或端口范围（如 10000-11000）。Hysteria2 填写范围时节点会在该范围内多端口监听以支持端口跳跃（跨度上限 1024）；其他协议范围仅用于订阅随机选端口。若使用中转/隧道，可与服务端口不同。",
        "sync": "同步到服务端口",
        "error": "连接端口不能为空"
      },
      "server_port": {
        "label": "服务端口",
        "placeholder": "请输入服务端口",
        "error": "服务端口不能为空",
        "tooltip": "服务器上的实际监听端口。Hysteria2 连接端口为范围时，节点按连接端口范围多端口监听，此字段作为兼容回退端口。",
        "sync": "同步到服务端口"
      },
      "listen_address": {
        "label": "监听地址",
        "placeholder": "留空使用默认 (0.0.0.0)，或输入: 127.0.0.1, ::1 等",
        "description": "指定服务器监听的 IP 地址。留空则使用默认地址 (0.0.0.0)，表示监听所有网络接口。可设置为 127.0.0.1 (仅本地) 或特定 IP 地址",
        "show": "监听地址",
        "hide": "隐藏监听地址",
        "optional": "可选"
      },
      "parent": {
        "label": "父级节点",
        "placeholder": "选择父节点",
        "none": "无",
        "hint": "选填；子节点会继承父节点协议配置与在线状态"
      },
      "virtualNode": {
        "label": "虚拟节点",
        "add": "添加虚拟节点",
        "addDialogTitle": "添加虚拟节点",
        "editDialogTitle": "编辑虚拟节点",
        "edit": "编辑",
        "delete": "删除",
        "save": "保存虚拟节点",
        "saveSuccess": "虚拟节点已保存",
        "saveFailed": "保存虚拟节点失败",
        "description": "虚拟节点是同一服务的额外接入点，与子父节点是独立功能",
        "empty": "暂无虚拟节点",
        "tagsPlaceholder": "输入后按回车添加",
        "host": "主机地址",
        "hostPlaceholder": "主机名 / 域名",
        "port": "端口",
        "groupIds": "权限组",
        "groupIdsHint": "只能选择父节点已包含的权限组，超出父节点将无法连接",
        "groupIdsParentEmpty": "请先为父节点选择权限组",
        "tags": "标签",
        "show": "显示",
        "visible": "显示",
        "hidden": "隐藏",
        "namePlaceholder": "虚拟节点名称",
        "deleteConfirmTitle": "确认删除",
        "deleteConfirmDesc": "确定要删除虚拟节点「{{name}}」吗？此操作不可恢复。",
        "deleteSuccess": "虚拟节点已删除",
        "deleteFailed": "删除失败",
        "toggleFailed": "更新显示状态失败",
        "generateKeyPair": "生成密钥对"
      },
      "route": {
        "label": "路由组",
        "placeholder": "选择路由组",
        "empty": "未找到结果"
      },
      "submit": "提交",
      "cancel": "取消",
      "success": "提交成功"
    },
    "networkTemplate": {
      "title": "网络模板",
      "empty": "当前协议暂无可用模板",
      "description": "选择一个预设网络模板，一键填充协议配置",
      "use": "使用"
    ,
      "presets": {
        "vless-tcp-vision": {
          "label": "TCP + XTLS Vision",
          "description": "VLESS + TCP + XTLS Vision 直连，速度极快，推荐"
        },
        "vless-ws-tls": {
          "label": "WebSocket + TLS + CDN",
          "description": "VLESS + WebSocket + TLS，可套 CDN（Cloudflare 等）"
        },
        "vless-grpc-tls": {
          "label": "gRPC + TLS",
          "description": "VLESS + gRPC + TLS，适合大规模负载"
        },
        "vless-tcp-reality": {
          "label": "TCP + REALITY",
          "description": "VLESS + REALITY 直连，无需证书，防主动探测"
        },
        "trojan-tls": {
          "label": "Trojan + TLS",
          "description": "标准 Trojan + TLS，端口 443"
        },
        "trojan-ws-tls": {
          "label": "Trojan + WebSocket + TLS",
          "description": "Trojan + WebSocket + TLS，可套 CDN"
        },
        "ss-simple": {
          "label": "标准 AEAD",
          "description": "Shadowsocks 加密隧道，简洁高效"
        },
        "hy-standard": {
          "label": "Hysteria 标准",
          "description": "Hysteria 基于 QUIC，抗丢包，适合弱网"
        },
        "hy-brutal": {
          "label": "Hysteria2 Brute",
          "description": "Hysteria2 + Brute 模式，极高带宽利用"
        },
        "tuic-v5": {
          "label": "TUIC v5 标准",
          "description": "TUIC v5 基于 QUIC，低延迟"
        },
        "anytls-default": {
          "label": "AnyTLS 默认",
          "description": "AnyTLS 自动化 TLS 伪装"
        },
        "sudoku-default": {
          "label": "Sudoku 默认",
          "description": "低熵表 + ChaCha20 + legacy HTTPMask"
        },
        "shadowquic-default": {
          "label": "ShadowQUIC 默认",
          "description": "JLS 伪装 + 0-RTT QUIC，默认上游 Cloudflare"
        }
      }},
    "dynamic_form": {
      "utls": {
        "fingerprint": {
          "random": "随机（订阅时抽取）",
          "randomized": "随机化（客户端内随机）"
        }
      },
      "multiplex": {
        "enabled": {
          "label": "多路复用 (Multiplex)",
          "description": "通过单条 TCP 连接传输多个流，降低握手延迟"
        },
        "protocol": {
          "label": "复用协议"
        },
        "max_connections": {
          "label": "最大连接数"
        },
        "min_streams": {
          "label": "最小流数"
        },
        "padding": {
          "label": "启用填充"
        },
        "brutal": {
          "enabled": {
            "label": "TCP Brutal (激进拥塞控制)"
          },
          "up_mbps": {
            "label": "上行带宽"
          },
          "down_mbps": {
            "label": "下行带宽"
          },
          "description": "TCP Brutal 是双边加速算法，建议带宽设为机器实际带宽的 80%-90%，开启后 BBR 将失效。"
        }
      },
      "ech": {
        "description": "为支持的 TLS 客户端启用 Encrypted Client Hello。留空配置时会尝试通过 DNS 查询。",
        "generate": "自动生成 ECH 密钥对",
        "generateSuccess": "ECH 密钥对已生成",
        "generateFailed": "生成 ECH 密钥失败",
        "config": {
          "label": "ECH 配置 (PEM)",
          "placeholder": "粘贴 PEM 格式的 ECH 配置，每行一段内容",
          "description": "留空时，sing-box 会尝试通过 DNS 加载 ECH 配置。"
        },
        "config_path": {
          "label": "ECH 配置文件路径",
          "placeholder": "/etc/sing-box/ech.pem",
          "description": "指向 PEM 格式 ECH 配置文件的路径。"
        },
        "query_server_name": {
          "label": "ECH 查询域名",
          "placeholder": "可选，用于覆盖 HTTPS 记录查询域名",
          "description": "覆盖用于 ECH HTTPS 记录查询的域名，留空时默认使用 server_name。"
        },
        "key": {
          "label": "ECH Key",
          "placeholder": "当后端需要时粘贴 ECH key 内容",
          "description": "后端需要时可填写的 ECH key 内容。"
        },
        "key_path": {
          "label": "ECH Key 路径",
          "placeholder": "/etc/sing-box/ech.key",
          "description": "后端需要时可填写的 ECH key 文件路径。"
        }
      },
      "anytls": {
        "tls": {
          "server_name": {
            "label": "服务器名称指示(SNI)",
            "placeholder": "当节点地址与证书不一致时用于证书验证"
          },
          "allow_insecure": "允许不安全连接"
        },
        "padding_scheme": {
          "label": "填充方案",
          "placeholder": "选择填充方案",
          "edit_btn": "编辑填充方案",
          "configured": "已配置 {{count}} 条规则",
          "not_configured": "未配置",
          "description": "用于混淆流量特征的填充方案，每行一条规则，支持通配符 *",
          "use_default": "使用默认方案"
        }
      },
      "shadowsocks": {
        "cipher": {
          "label": "加密算法",
          "placeholder": "选择加密算法",
          "search_placeholder": "搜索或输入自定义加密方式...",
          "description": "选择预设加密方式或输入自定义加密方式",
          "preset_group": "预设加密方式",
          "custom_group": "自定义加密方式",
          "current_value": "当前值",
          "use_custom": "使用",
          "no_results": "未找到匹配的加密方式",
          "custom_hint": "你可以直接输入自定义的加密方式，如：aes-256-cfb",
          "custom_label": "自定义"
        },
        "plugin": {
          "label": "插件",
          "placeholder": "选择插件",
          "obfs_hint": "提示：配置格式如 obfs=http;obfs-host=www.bing.com;path=/",
          "v2ray_hint": "提示：WebSocket模式格式为 mode=websocket;host=mydomain.me;path=/;tls=true，QUIC模式格式为 mode=quic;host=mydomain.me",
          "gost_hint": "提示：配置格式如 mode=websocket;host=mydomain.me;path=/;tls=true",
          "shadow_tls_hint": "提示：配置格式如 host=cloud.tencent.com;password=auth_password;version=3",
          "restls_hint": "提示：配置格式如 host=www.microsoft.com;password=auth_password;version-hint=tls13;restls-script=300?100<1,400~100",
          "kcptun_hint": "提示：配置格式如 key=psk;crypt=aes-128-gcm;mode=fast;mtu=1350"
        },
        "plugin_opts": {
          "label": "插件选项",
          "description": "按照 key=value;key2=value2 格式输入插件选项",
          "placeholder": "例如: mode=tls;host=bing.com"
        },
        "client_fingerprint": "客户端指纹",
        "client_fingerprint_placeholder": "选择客户端指纹",
        "client_fingerprint_description": "客户端伪装指纹，用于降低被识别风险",
        "obfs": {
          "label": "混淆",
          "placeholder": "选择混淆方式",
          "none": "无",
          "http": "HTTP"
        },
        "obfs_settings": {
          "path": "路径",
          "host": "Host"
        },
        "cert_config": {
          "tab": "TLS 证书",
          "cert_mode": {
            "label": "证书模式",
            "description": "选择证书申请方式，仅部分后端节点支持",
            "self_description": "自签名模式：仅需填写域名，证书由节点后端自动生成（10年有效期）",
            "http_description": "HTTP-01 模式：需要 80 端口可正常访问以完成认证",
            "dns_description": "DNS-01 模式：通过 DNS 解析记录认证，支持申请泛域名证书",
            "content_description": "内容推送模式：直接将证书内容下发至节点"
          },
          "domain": {
            "label": "证书域名",
            "placeholder": "example.com"
          },
          "email": {
            "label": "通知邮箱",
            "placeholder": "admin@example.com"
          },
          "http_port": {
            "label": "认证端口",
            "description": "ACME 认证端口 (默认 80)"
          },
          "dns_provider": {
            "label": "DNS 提供商",
            "doc_link": "查看 DNS 提供商配置指南"
          },
          "dns_env": {
            "label": "环境变量 (API 密钥)",
            "description_short": "每行一个 KEY=VALUE 配置"
          },
          "cert_content": {
            "label": "证书内容 (PEM)",
            "placeholder": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
            "description": "粘贴完整证书 PEM 正文，不是文件路径"
          },
          "key_content": {
            "label": "私钥内容 (PEM)",
            "placeholder": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
            "description": "粘贴完整私钥 PEM 正文，不是文件路径"
          },
          "templates": {
            "title": "证书模板",
            "save_current": "保存当前为模板",
            "save": "保存模板",
            "saved": "证书模板已保存",
            "save_failed": "保存证书模板失败",
            "deleted": "证书模板已删除",
            "delete_failed": "删除证书模板失败",
            "delete": "删除模板",
            "use": "使用",
            "applied": "已应用证书模板：{{name}}",
            "name_required": "请输入模板名称",
            "name_placeholder": "模板名称，例如：生产证书",
            "description_placeholder": "模板描述（可选）",
            "search_placeholder": "搜索模板名称或描述…",
            "empty_content": "请先填写证书内容与私钥内容，再保存为模板",
            "empty": "暂无证书模板"
          },
          "none_desc": "未启用 TLS 证书配置"
        }
      },
      "vmess": {
        "tls": {
          "label": "TLS",
          "placeholder": "请选择安全性",
          "disabled": "不支持",
          "enabled": "支持"
        },
        "tls_settings": {
          "server_name": {
            "label": "服务器名称指示(SNI)",
            "placeholder": "不使用请留空"
          },
          "allow_insecure": "允许不安全?"
        },
        "network": {
          "label": "传输协议",
          "placeholder": "选择传输协议"
        }
      },
      "trojan": {
        "server_name": {
          "label": "服务器名称指示(SNI)",
          "placeholder": "当节点地址于证书不一致时用于证书验证"
        },
        "allow_insecure": "允许不安全?",
        "reality_settings": {
          "server_name": {
            "label": "伪装站点(dest)",
            "placeholder": "例如：example.com"
          },
          "server_port": {
            "label": "端口(port)",
            "placeholder": "例如：443"
          },
          "allow_insecure": "允许不安全?",
          "private_key": {
            "label": "私钥(Private key)"
          },
          "public_key": {
            "label": "公钥(Public key)"
          },
          "short_id": {
            "label": "Short ID",
            "placeholder": "可留空，长度为2的倍数，最长16位",
            "description": "客户端可用的 shortId 列表，可用于区分不同的客户端，使用0-f的十六进制字符",
            "generate": "生成 Short ID",
            "success": "Short ID 生成成功"
          },
          "key_pair": {
            "generate": "生成密钥对",
            "success": "密钥对生成成功",
            "error": "生成密钥对失败"
          }
        },
        "network": {
          "label": "传输协议",
          "placeholder": "选择传输协议"
        }
      },
      "hysteria": {
        "version": {
          "label": "协议版本",
          "placeholder": "协议版本"
        },
        "alpn": {
          "label": "ALPN",
          "placeholder": "ALPN"
        },
        "obfs": {
          "label": "混淆",
          "type": {
            "label": "混淆实现",
            "placeholder": "选择混淆实现",
            "salamander": "Salamander"
          },
          "password": {
            "label": "混淆密码",
            "placeholder": "请输入混淆密码",
            "generate_success": "混淆密码生成成功"
          }
        },
        "tls": {
          "server_name": {
            "label": "服务器名称指示(SNI)",
            "placeholder": "当节点地址于证书不一致时用于证书验证"
          },
          "allow_insecure": "允许不安全?"
        },
        "bandwidth": {
          "up": {
            "label": "上行宽带",
            "placeholder": "请输入上行宽带",
            "suffix": "Mbps",
            "bbr_tip": "，留空则使用BBR"
          },
          "down": {
            "label": "下行宽带",
            "placeholder": "请输入下行宽带",
            "suffix": "Mbps",
            "bbr_tip": "，留空则使用BBR"
          }
        }
      },
      "vless": {
        "tls": {
          "label": "安全性",
          "placeholder": "请选择安全性",
          "none": "无",
          "tls": "TLS",
          "reality": "Reality"
        },
        "tls_settings": {
          "server_name": {
            "label": "服务器名称指示(SNI)",
            "placeholder": "不使用请留空"
          },
          "allow_insecure": "允许不安全?"
        },
        "reality_settings": {
          "server_name": {
            "label": "伪装站点(dest)",
            "placeholder": "例如：example.com"
          },
          "server_port": {
            "label": "端口(port)",
            "placeholder": "例如：443"
          },
          "allow_insecure": "允许不安全?",
          "private_key": {
            "label": "私钥(Private key)"
          },
          "public_key": {
            "label": "公钥(Public key)"
          },
          "short_id": {
            "label": "Short ID",
            "placeholder": "可留空，长度为2的倍数，最长16位",
            "description": "客户端可用的 shortId 列表，可用于区分不同的客户端，使用0-f的十六进制字符",
            "generate": "生成 Short ID",
            "success": "Short ID 生成成功"
          },
          "key_pair": {
            "generate": "生成密钥对",
            "success": "密钥对生成成功",
            "error": "生成密钥对失败"
          }
        },
        "network": {
          "label": "传输协议",
          "placeholder": "选择传输协议"
        },
        "flow": {
          "label": "流控",
          "placeholder": "选择流控"
        },
        "encryption": {
          "label": "VLESS Encryption",
          "description": "启用 VLESS 加密",
          "server_label": "decryption",
          "server_placeholder": "./xray vlessenc 生成",
          "server_description": "服务端 decryption 参数，可由 ./xray vlessenc 生成",
          "client_label": "encryption",
          "client_placeholder": "./xray vlessenc 生成",
          "client_description": "客户端 encryption 参数，需与服务端配对",
          "generate_hint": "./xray vlessenc 生成"
        }
      },
      "tuic": {
        "version": {
          "label": "协议版本",
          "placeholder": "选择TUIC版本"
        },
        "password": {
          "label": "密码",
          "placeholder": "请输入密码",
          "generate_success": "密码生成成功"
        },
        "congestion_control": {
          "label": "拥塞控制",
          "placeholder": "选择拥塞控制算法"
        },
        "udp_relay_mode": {
          "label": "UDP中继模式",
          "placeholder": "选择UDP中继模式"
        },
        "tls": {
          "server_name": {
            "label": "服务器名称指示(SNI)",
            "placeholder": "当节点地址与证书不一致时用于证书验证"
          },
          "allow_insecure": "允许不安全?",
          "alpn": {
            "label": "ALPN",
            "placeholder": "选择ALPN协议",
            "empty": "未找到可用的ALPN协议"
          }
        }
      },
      "socks": {
        "version": {
          "label": "协议版本",
          "placeholder": "选择SOCKS版本"
        },
        "tls": {
          "label": "TLS",
          "placeholder": "请选择安全性",
          "disabled": "不支持",
          "enabled": "支持"
        },
        "tls_settings": {
          "server_name": {
            "label": "服务器名称指示(SNI)",
            "placeholder": "不使用请留空"
          },
          "allow_insecure": "允许不安全?"
        },
        "network": {
          "label": "传输协议",
          "placeholder": "选择传输协议"
        }
      },
      "sudoku": {
        "name": "Sudoku",
        "keyPairTitle": "Sudoku 密钥对",
        "keyPairDescription": "服务端使用 Master Public Key；Master Private Key 仅保存在面板用于派生用户密钥，不会下发到节点",
        "generate": "一键生成",
        "generateSuccess": "Sudoku 密钥对已生成",
        "generateFailed": "生成 Sudoku 密钥失败",
        "publicPlaceholder": "点击右上角「一键生成」自动填写",
        "privatePlaceholder": "仅面板保存，勿泄露",
        "master_public_key": "Master 公钥",
        "master_private_key": "Master 私钥",
        "aead_method": "AEAD 算法",
        "padding_min": "最小填充率",
        "padding_max": "最大填充率",
        "table_type": "表类型",
        "enable_pure_downlink": "纯 Sudoku 下行",
        "custom_table": "自定义表",
        "custom_tables": "自定义表列表",
        "handshake_timeout": "握手超时",
        "fallback": "回落地址",
        "multiplex": "多路复用",
        "httpmask": "HTTPMask"
      },
      "naive": {
        "tls_settings": {
          "server_name": {
            "label": "服务器名称指示(SNI)",
            "placeholder": "不使用请留空"
          },
          "allow_insecure": "允许不安全?"
        },
        "tls": {
          "label": "TLS",
          "placeholder": "请选择安全性",
          "disabled": "不支持",
          "enabled": "支持",
          "server_name": {
            "label": "服务器名称指示(SNI)",
            "placeholder": "当节点地址与证书不一致时用于证书验证"
          },
          "allow_insecure": "允许不安全连接"
        }
      },
      "http": {
        "tls": {
          "label": "TLS",
          "placeholder": "请选择安全性",
          "disabled": "不支持",
          "enabled": "支持",
          "server_name": {
            "label": "服务器名称指示(SNI)",
            "placeholder": "当节点地址与证书不一致时用于证书验证"
          },
          "allow_insecure": "允许不安全连接"
        },
        "tls_settings": {
          "server_name": {
            "label": "服务器名称指示(SNI)",
            "placeholder": "当节点地址与证书不一致时用于证书验证"
          },
          "allow_insecure": "允许不安全连接"
        }
      },
      "mieru": {
        "transport": {
          "label": "传输协议",
          "placeholder": "选择传输协议"
        },
        "traffic_pattern": {
          "label": "流量特征伪装 (Base64)",
          "placeholder": "留空使用默认；或点击右侧按钮生成",
          "description": "可选。官方 mieru Traffic Pattern 的 Base64 串，用于 TCP 分片 / Nonce 前缀等抗 DPI 流量整形；可用 mita/mieru export traffic-pattern 导出。",
          "generate": "生成流量特征伪装",
          "success": "流量特征伪装已生成"
        }
      },
      "cert_config": {
        "tab": "TLS 证书",
        "none_desc": "未启用 TLS 证书配置",
        "cert_mode": {
          "label": "证书模式",
          "description": "选择证书申请方式，仅部分后端节点支持",
          "none_desc": "未启用 TLS 证书配置"
        },
        "domain": {
          "label": "证书域名"
        },
        "email": {
          "label": "通知邮箱"
        },
        "http_port": {
          "label": "挑战端口",
          "description": "ACME 挑战端口 (默认 80)"
        },
        "dns_provider": {
          "label": "DNS 提供商",
          "doc_link": "查看 DNS 提供商配置指南"
        },
        "dns_env": {
          "label": "环境变量 (API 密钥)",
          "description_short": "每行一个 KEY=VALUE 配置"
        },
        "cert_content": {
          "label": "证书内容 (PEM)",
          "placeholder": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
          "description": "粘贴完整证书 PEM 正文，不是文件路径"
        },
        "key_content": {
          "label": "私钥内容 (PEM)",
          "placeholder": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
          "description": "粘贴完整私钥 PEM 正文，不是文件路径"
        },
        "templates": {
          "title": "证书模板",
          "save_current": "保存当前为模板",
          "save": "保存模板",
          "saved": "证书模板已保存",
          "save_failed": "保存证书模板失败",
          "deleted": "证书模板已删除",
          "delete_failed": "删除证书模板失败",
          "delete": "删除模板",
          "use": "使用",
          "applied": "已应用证书模板：{{name}}",
          "name_required": "请输入模板名称",
          "name_placeholder": "模板名称，例如：生产证书",
          "description_placeholder": "模板描述（可选）",
          "search_placeholder": "搜索模板名称或描述…",
          "empty_content": "请先填写证书内容与私钥内容，再保存为模板",
          "empty": "暂无证书模板"
        }
      },
      "routing": {
        "outbounds_tab": "自定义 Outbounds",
        "routes_tab": "自定义 Routes",
        "outbounds": "自定义 Outbounds (JSON)",
        "routes": "自定义 Routes (JSON)",
        "error": {
          "must_be_array": "必须是一个 JSON 数组 []",
          "invalid_json": "无效的 JSON 格式"
        }
      },
      "advanced": {
        "trigger_label": "高级设置",
        "dialog_title": "高级协议配置",
        "tls_tab": "TLS",
        "route_tab": "路由",
        "multiplex_tab": "多路复用"
      }
    },
    "network_settings": {
      "edit_protocol": "编辑协议",
      "edit_protocol_config": "编辑网络设置",
      "edit_padding_scheme": "编辑填充方案",
      "use_template": "使用{{template}}模板",
      "json_label": "网络设置 (JSON)",
      "json_config_placeholder": "请输入 JSON 格式的网络设置",
      "json_config_placeholder_with_template": "请输入 JSON 配置，例如 path / host / serviceName 等",
      "templates": "模板列表",
      "templates_empty": "暂无可用模板，可将当前配置保存为模板",
      "templates_custom": "我的模板",
      "templates_builtin": "内置模板",
      "builtin": "内置",
      "save_as_template": "保存当前为模板",
      "save_template": "保存模板",
      "delete_template": "删除模板",
      "use_template_btn": "使用",
      "template_name_placeholder": "模板名称，例如：WS 自定义路径",
      "template_name_required": "请输入模板名称",
      "template_empty": "当前配置为空，无法保存为模板",
      "template_from_current": "来自当前 {{network}} 配置",
      "template_custom_desc": "自定义网络设置模板",
      "template_saved": "模板已保存",
      "template_save_failed": "保存模板失败",
      "template_deleted": "模板已删除",
      "template_delete_failed": "删除模板失败",
      "template_applied": "已应用模板：{{name}}",
      "validation": {
        "must_be_array": "配置必须是一个JSON数组",
        "must_be_object": "配置必须是一个JSON对象",
        "invalid_json": "无效的JSON格式"
      },
      "errors": {
        "save_failed": "保存时发生错误"
      }
    ,
      "builtin_templates": {
        "ws-basic": {
          "name": "WebSocket 基础",
          "description": "path + Host"
        },
        "ws-cdn": {
          "name": "WebSocket + CDN",
          "description": "适合 Cloudflare 等 CDN"
        },
        "grpc-basic": {
          "name": "gRPC 基础",
          "description": "serviceName"
        },
        "grpc-multi": {
          "name": "gRPC multiMode",
          "description": "开启 multiMode"
        },
        "http-basic": {
          "name": "HTTP/2 基础",
          "description": "path + host"
        },
        "tcp-none": {
          "name": "TCP 无伪装",
          "description": "纯 TCP"
        },
        "tcp-http": {
          "name": "TCP HTTP 伪装",
          "description": "header type = http"
        },
        "xhttp-basic": {
          "name": "XHTTP 基础",
          "description": "path 模式"
        },
        "quic-basic": {
          "name": "QUIC 基础",
          "description": "security + key"
        },
        "kcp-basic": {
          "name": "KCP 基础",
          "description": "mtu / tti 默认"
        }
      }},
    "common": {
      "cancel": "取消",
      "confirm": "确定"
    },
    "description": "配置节点通信与同步设置，包括通信密钥、轮询间隔、负载均衡等高级选项。",
    "device_limit_mode": {
      "description": "宽松模式下，同一 IP 地址的多个节点计为 1 台设备。",
      "placeholder": "请选择设备限制模式",
      "relaxed": "宽松模式",
      "strict": "严格模式",
      "title": "设备限制模式"
    },
    "saving": "保存中...",
    "server_pull_interval": {
      "description": "节点从面板拉取数据的频率。",
      "placeholder": "请输入拉取间隔",
      "title": "节点拉取轮询间隔"
    },
    "server_push_interval": {
      "description": "节点向面板推送数据的频率。",
      "placeholder": "请输入推送间隔",
      "title": "节点推送轮询间隔"
    },
    "server_token": {
      "description": "面板与节点通信的密钥，用于防止未授权访问。",
      "placeholder": "请输入通信密钥",
      "title": "通信密钥"
    },
    "title": "节点配置",
    "messages": {
      "saveFailed": "保存失败"
    }
  },
  "coupon": {
    "title": "优惠券管理",
    "description": "在这里可以查看优惠券，包括增加、查看、删除等操作。",
    "table": {
      "columns": {
        "id": "ID",
        "select": "选择",
        "show": "启用",
        "name": "卷名称",
        "type": "类型",
        "code": "卷码",
        "limitUse": "剩余次数",
        "limitUseWithUser": "可用次数/用户",
        "validity": "有效期",
        "actions": "操作"
      },
      "validity": {
        "expired": "已过期{{days}}天",
        "notStarted": "{{days}}天后开始",
        "remaining": "剩余{{days}}天",
        "startTime": "开始时间",
        "endTime": "结束时间",
        "unlimited": "无限次",
        "noLimit": "无限制"
      },
      "actions": {
        "edit": "编辑",
        "delete": "删除",
        "deleteConfirm": {
          "title": "确认删除",
          "description": "此操作将永久删除该优惠券，删除后无法恢复。确定要继续吗？",
          "confirmText": "删除"
        },
        "batchDelete": "批量删除 ({{count}})",
        "batchDeleteConfirm": {
          "title": "批量删除",
          "description": "确定要删除选中的 {{count}} 张优惠券吗？删除后无法恢复。"
        },
        "dropExpired": "删除已过期",
        "dropExpiredConfirm": {
          "title": "删除已过期优惠券",
          "description": "确定要删除所有已过期的优惠券吗？删除后无法恢复。"
        },
        "dropExpiredResult": {
          "success": "已删除 {{count}} 张过期优惠券",
          "empty": "没有找到已过期的优惠券"
        },
        "dropUsedUp": "删除已用完",
        "dropUsedUpConfirm": {
          "title": "删除已用完优惠券",
          "description": "确定要删除所有剩余次数为 0 的优惠券吗？删除后无法恢复。"
        },
        "dropUsedUpResult": {
          "success": "已删除 {{count}} 张已用完优惠券",
          "empty": "没有找到剩余次数为 0 的优惠券"
        }
      },
      "toolbar": {
        "search": "搜索优惠券...",
        "type": "类型",
        "reset": "重置",
        "types": {
          "1": "按金额优惠",
          "2": "按比例优惠"
        }
      }
    },
    "form": {
      "add": "添加优惠券",
      "edit": "编辑优惠券",
      "name": {
        "label": "优惠券名称",
        "placeholder": "请输入优惠券名称",
        "required": "请输入优惠券名称"
      },
      "type": {
        "label": "优惠券类型和值",
        "placeholder": "优惠券类型"
      },
      "value": {
        "placeholder": "请输入金额（元）"
      },
      "validity": {
        "label": "优惠券有效期",
        "to": "至",
        "endTimeError": "结束时间必须晚于开始时间"
      },
      "limitUse": {
        "label": "最大使用次数",
        "placeholder": "限制最大使用次数，留空则不限制",
        "description": "设置优惠券的总使用次数限制，留空表示不限制使用次数"
      },
      "limitUseWithUser": {
        "label": "每个用户可使用次数",
        "placeholder": "限制每个用户可使用次数，留空则不限制",
        "description": "限制每个用户可使用该优惠券的次数，留空表示不限制单用户使用次数"
      },
      "limitPeriod": {
        "label": "指定周期",
        "placeholder": "限制指定周期可以使用优惠，留空则不限制",
        "description": "选择可以使用优惠券的订阅周期，留空表示不限制使用周期",
        "empty": "没有找到匹配的周期"
      },
      "limitPlan": {
        "label": "指定订阅",
        "placeholder": "限制指定订阅可以使用优惠，留空则不限制",
        "description": "选择可以使用优惠券的订阅计划，留空表示不限制计划",
        "empty": "没有找到匹配的订阅"
      },
      "code": {
        "label": "自定义优惠码",
        "placeholder": "自定义优惠码，留空则自动生成",
        "description": "可以自定义优惠码，留空则系统自动生成"
      },
      "generateCount": {
        "label": "批量生成数量",
        "placeholder": "批量生成优惠码数量，留空则生成单个",
        "description": "批量生成多个优惠码，留空则只生成单个优惠码"
      },
      "submit": {
        "saving": "保存中...",
        "save": "保存"
      },
      "error": {
        "saveFailed": "保存优惠券失败"
      },
      "timeRange": {
        "quickSet": "快速设置",
        "presets": {
          "1week": "1周",
          "2weeks": "2周",
          "1month": "1个月",
          "3months": "3个月",
          "6months": "6个月",
          "1year": "1年"
        }
      }
    },
    "period": {
      "hourly": "小时",
      "daily": "天",
      "monthly": "月",
      "quarterly": "季度",
      "half_yearly": "半年",
      "yearly": "年",
      "two_yearly": "两年",
      "three_yearly": "三年",
      "onetime": "一次性",
      "reset_traffic": "重置流量"
    }
  },
  "route": {
    "title": "路由管理",
    "description": "管理所有路由组，包括添加、删除、编辑等操作。",
    "columns": {
      "id": "组ID",
      "remarks": "备注",
      "action": "动作",
      "actions": "操作",
      "matchRules": "匹配{{count}}条规则",
      "action_value": {
        "title": "动作值",
        "dns": "DNS: {{value}}",
        "proxy": "转发 ({{value}})",
        "block": "阻止访问",
        "direct": "直连"
      }
    },
    "actions": {
      "dns": "指定DNS服务器进行解析",
      "block": "禁止访问",
      "direct": "直连",
      "proxy": "转发",
      "short": {
        "dns": "DNS",
        "block": "阻止",
        "direct": "直连",
        "proxy": "转发"
      }
    },
    "form": {
      "add": "添加路由",
      "edit": "编辑路由",
      "create": "创建路由",
      "remarks": "备注",
      "remarksPlaceholder": "请输入备注",
      "match": "匹配规则",
      "matchPlaceholder": "example.com\n*.example.com",
      "action": "动作",
      "actionPlaceholder": "请选择动作",
      "dns": "DNS服务器",
      "dnsPlaceholder": "请输入DNS服务器",
      "proxy": "转发标签 (Outbound Tag)",
      "proxyPlaceholder": "请输入转发标签",
      "cancel": "取消",
      "submit": "提交",
      "validation": {
        "remarks": "请输入有效的备注"
      }
    },
    "toolbar": {
      "searchPlaceholder": "搜索路由...",
      "reset": "重置"
    },
    "messages": {
      "deleteConfirm": "确认删除",
      "deleteDescription": "此操作将永久删除该路由组，删除后无法恢复。确定要继续吗？",
      "deleteButton": "删除",
      "deleteSuccess": "删除成功",
      "createSuccess": "创建成功",
      "updateSuccess": "更新成功"
    }
  },
  "ticket": {
    "title": "工单管理",
    "description": "在这里可以查看用户工单，包括查看、回复、关闭等操作。",
    "columns": {
      "id": "工单号",
      "subject": "主题",
      "level": "优先级",
      "status": "状态",
      "updated_at": "最后更新",
      "created_at": "创建时间",
      "actions": "操作"
    },
    "status": {
      "closed": "已关闭",
      "replied": "已回复",
      "pending": "待回复",
      "processing": "处理中",
      "unreplied": "未回复"
    },
    "level": {
      "low": "低优先",
      "medium": "中优先",
      "high": "高优先"
    },
    "filter": {
      "placeholder": "搜索{field}...",
      "no_results": "未找到结果",
      "selected": "已选择 {count} 项",
      "clear": "清除筛选"
    },
    "actions": {
      "reply_success": "已回复",
      "view_details": "查看详情",
      "close_ticket": "关闭工单",
      "close_confirm_title": "确认关闭工单",
      "close_confirm_description": "确定要关闭这个工单吗？关闭后会移入已关闭列表，但仍可继续回复。",
      "close_confirm_button": "确认关闭",
      "close_success": "工单已关闭",
      "view_ticket": "查看工单"
    },
    "detail": {
      "no_messages": "暂无消息记录",
      "created_at": "创建于",
      "sender_admin": "管理员",
      "sender_user": "用户",
      "user_info": "用户信息",
      "traffic_records": "流量记录",
      "order_records": "订单记录",
      "input": {
        "closed_reply_placeholder": "工单已关闭，仍可继续回复...",
        "closed_hint": "该工单已关闭，你仍可以继续回复，新的消息会追加到当前工单。",
        "reply_placeholder": "输入回复内容...",
        "sending": "发送中...",
        "send": "发送",
        "shortcut_hint": "Enter 发送 · Shift + Enter 换行"
      }
    },
    "list": {
      "title": "工单列表",
      "search_placeholder": "搜索工单标题或用户邮箱",
      "no_tickets": "暂无工单",
      "no_open_tickets": "暂无处理中工单",
      "no_closed_tickets": "暂无已关闭工单",
      "no_search_results": "未找到匹配的工单",
      "collapse": "收起列表",
      "expand": "展开列表"
    }
  },
    "withdrawal": {
    "title": "提现管理",
    "description": "管理用户的佣金提现申请，支持确认提现和拒绝提现操作。",
    "columns": {
      "id": "提现单号",
      "user": "用户",
      "method": "提现方式",
      "account": "提现账号",
      "amount": "金额",
      "status": "状态",
      "created_at": "创建时间",
      "actions": "操作"
    },
    "status": {
      "pending": "待处理",
      "confirmed": "已确认",
      "closed": "已拒绝"
    },
    "filter": {
      "all": "全部"
    },
    "actions": {
      "view": "查看详情",
      "confirm": "确认提现",
      "close": "关闭提现",
      "user_info": "用户信息",
      "confirm_title": "确认提现",
      "confirm_description": "确认后将关闭该提现单，请确保款项已处理。",
      "confirm_button": "确认提现",
      "confirm_success": "提现已确认",
      "close_confirm_title": "关闭提现",
      "close_confirm_description": "关闭后将把佣金返还给用户账户。",
      "close_confirm_button": "确认关闭",
      "close_success": "提现已关闭，佣金已返还",
      "reply_success": "回复成功",
      "confirm_desc": "确认后将关闭该提现单，请确保款项已处理。",
      "close_desc": "关闭后将把佣金返还给用户账户，是否继续？"
    },
    "list": {
      "search_placeholder": "搜索提现账号...",
      "no_withdrawals": "暂无提现记录",
      "no_open_withdrawals": "暂无待处理提现",
      "title": "提现列表",
      "collapse": "收起列表",
      "expand": "展开列表"
    },
    "detail": {
      "created_at": "创建时间",
      "user_info": "用户信息",
      "traffic_records": "流量记录",
      "order_records": "订单记录",
      "no_messages": "暂无聊天记录",
      "operator": "操作员",
      "remark": "备注",
      "remark_placeholder": "输入备注（可选）",
      "sender_user": "用户",
      "sender_admin": "管理员",
      "input": {
        "closed_hint": "该提现单已处理，无法继续回复",
        "reply_placeholder": "输入消息...",
        "closed_reply_placeholder": "该提现单已处理",
        "send": "发送",
        "sending": "发送中...",
        "shortcut_hint": "回车发送，Shift+回车换行"
      }
    }
  },

  "machine": {
    "title": "服务器管理",
    "description": "用于查看服务器健康、负载与承载节点，并从运维视角管理 Fboard-Node 服务。",
    "columns": {
      "id": "ID",
      "name": "服务器名称",
      "status": "状态",
      "nodes": "节点数",
      "nodesHosted": "节点数",
      "nodesIdle": "暂无承载",
      "load": "负载",
      "lastSeen": "最后心跳",
      "version": "版本",
      "actions": "操作",
      "online": "在线",
      "offline": "离线",
      "inactive": "已禁用",
      "noData": "暂无负载数据",
      "cpu": "CPU",
      "memory": "内存",
      "disk": "磁盘",
      "never": "从未上报",
      "lastReport": "负载上报",
      "kernel": "内核",
      "kernelRunning": "运行中",
      "kernelStopped": "已停止",
      "kernelPartial": "部分运行",
      "kernelIdle": "无节点",
      "kernelUnknown": "未知",
      "kernelDetail": "{{running}}/{{total}} 运行"
    },
    "toolbar": {
      "search": "搜索服务器名称或备注...",
      "status": "状态",
      "status_all": "全部状态",
      "status_online": "在线",
      "status_offline": "离线",
      "status_inactive": "已禁用",
      "status_high_load": "高负载",
      "nodes": "节点",
      "with_nodes": "已承载节点",
      "idle_nodes": "空闲服务器",
      "high_load": "高负载",
      "online_ratio": "在线",
      "high_load_count": "高负载",
      "tip": "适合集中查看服务器在线情况、承载节点数量与资源压力。",
      "reset": "重置",
      "nodesHosted": "节点",
      "nodesIdle": "空闲"
    },
    "operations": {
      "upgrade": "升级 Fboard-Node",
      "ops": "内核运维",
      "start": "启动内核",
      "stop": "停止内核",
      "reload": "重载内核",
      "restart": "重启内核",
      "upgradeTitle": "确认升级服务器",
      "upgradeDescription": "将升级服务器“{{name}}”上的 Fboard-Node 服务。升级过程中该服务器上的服务可能短暂中断。",
      "startTitle": "确认启动内核",
      "startDescription": "将启动服务器“{{name}}”上所有节点的内嵌 xray 内核。fboard-node 进程与 WebSocket 保持运行。",
      "stopTitle": "确认停止内核",
      "stopDescription": "将停止服务器“{{name}}”上所有节点的内嵌 xray 内核，该服务器上的代理将不可用，直到再次启动。进程与 WebSocket 保持运行。",
      "reloadTitle": "确认重载内核",
      "reloadDescription": "将重载服务器“{{name}}”上所有节点的内嵌 xray 内核配置；进程与 WebSocket 保持运行。",
      "restartTitle": "确认重启内核",
      "restartDescription": "将强制重建服务器“{{name}}”上所有节点的内嵌 xray 内核，代理会短暂中断。fboard-node 进程与 WebSocket 保持运行。",
      "upgradeSubmitted": "服务器“{{name}}”的升级任务已提交",
      "startSubmitted": "服务器“{{name}}”的内核启动任务已提交",
      "stopSubmitted": "服务器“{{name}}”的内核停止任务已提交",
      "reloadSubmitted": "服务器“{{name}}”的内核重载任务已提交",
      "restartSubmitted": "服务器“{{name}}”的内核重启任务已提交",
      "batchUpgrade": "一键升级服务器",
      "batchUpgradeTitle": "确认批量升级服务器",
      "batchUpgradeDescription": "将对所有在线且启用的服务器各提交一次 Fboard-Node 升级任务，不依赖服务器承载的节点数量。",
      "batchUpgradeSubmitted": "已提交 {{submitted}} 台服务器；跳过 {{inactive}} 台禁用、{{offline}} 台离线服务器"
    },

    "overview": {
      "total": "服务器总数",
      "total_hint": "共承载 {{count}} 个节点",
      "online": "在线服务器",
      "online_hint": "最近 5 分钟内正常心跳",
      "offline": "离线/失联",
      "offline_hint": "需要检查心跳或节点代理",
      "high_load": "高负载",
      "high_load_hint": "CPU、内存或磁盘接近阈值",
      "nodes_suffix": "节点",
      "attention": "需关注",
      "stable": "稳定",
      "needs_review": "建议检查",
      "normal": "正常"
    },
    "form": {
      "add": "添加服务器",
      "create": "新建服务器",
      "edit": "编辑服务器",
      "createDescription": "当你希望一台服务器承载多个节点时，再创建服务器记录。",
      "editDescription": "修改服务器名称、备注或启用状态。",
      "name": "服务器名称",
      "namePlaceholder": "例如 HK-01",
      "nameError": "请输入服务器名称",
      "notes": "备注",
      "notesPlaceholder": "关于此服务器的可选备注",
      "isActive": "启用服务器",
      "isActiveDescription": "禁用后 Fboard-Node 将不再使用此服务器。",
      "cancel": "取消",
      "submit": "提交",
      "update": "更新"
    },
    "token": {
      "title": "服务器 Token",
      "description": "此 Token 用于 Fboard-Node 向面板认证，请妥善保管。",
      "show": "查看 Token",
      "hide": "隐藏 Token",
      "reset": "重置 Token",
      "resetConfirm": "确认重置 Token？",
      "resetDescription": "旧 Token 将立即失效，Fboard-Node 需要重新配置新 Token。",
      "copy": "复制",
      "copied": "Token 已复制到剪贴板",
      "copiedInline": "已复制!",
      "copyFailed": "复制失败，请手动复制",
      "autoHide": "{{time}} 后自动隐藏",
      "resetSuccess": "Token 已重置",
      "createdHint": "Token 已生成，后续可在服务器详情页中查看。"
    },
    "install": {
      "title": "安装 Fboard-Node",
      "description": "在目标服务器上执行此命令，即可用 machine mode 安装 Fboard-Node 并接入当前服务器记录。",
      "copy": "复制安装命令",
      "copied": "安装命令已复制",
      "copiedInline": "已复制!",
      "copyFailed": "复制失败",
      "loading": "正在生成命令...",
      "hint": "需要 root 或 sudo 权限，且目标服务器需为支持 systemd 的 Linux。"
    },
    "logs": {
      "title": "运行日志",
      "description": "来自 Fboard-Node 进程内存中的最近日志（最多约 1000 行）。",
      "refresh": "刷新日志",
      "copy": "复制日志",
      "copied": "日志已复制",
      "loading": "正在拉取日志...",
      "empty": "暂无日志",
      "offline": "服务器离线，无法拉取实时日志",
      "stale": "显示缓存日志（可能不是最新）",
      "timeout": "等待节点响应超时",
      "updatedAt": "更新于 {{time}}",
      "lineCount": "{{count}} 行",
      "autoScroll": "自动滚动到底部",
      "fetchFailed": "拉取日志失败"
    },
    "detail": {
      "title": "服务器详情",
      "info": "服务器信息",
      "associatedNodes": "关联节点",
      "noNodes": "暂无绑定节点。",
      "nodeId": "ID",
      "nodeName": "名称",
      "nodeType": "类型",
      "nodeHost": "地址",
      "nodePort": "端口",
      "nodeShow": "可见",
      "nodeEnabled": "已激活",
      "loadTrend": "负载趋势",
      "networkTrend": "网络速率",
      "noHistory": "暂无历史负载数据",
      "openNodeManage": "前往节点管理",
      "addNodeToServer": "新增节点到此服务器",
      "nodeCount": "{{count}} 个节点",
      "nodeEnabledCount": "{{count}} 个已激活",
      "toggleEnabledError": "切换节点状态失败",
      "bindExistingButton": "关联已有节点",
      "bindExistingTitle": "关联已有节点",
      "bindExistingDescription": "选择要关联到「{{name}}」的节点",
      "bindSearchPlaceholder": "搜索节点名称、地址、类型...",
      "bindTypeAll": "全部类型",
      "noUnboundNodes": "没有未绑定的节点",
      "noSearchResults": "没有匹配的节点",
      "selectAll": "全选（共 {{count}} 个）",
      "selectedCount": "已选 {{count}} 个",
      "bindConfirm": "关联 {{count}} 个节点",
      "binding": "关联中...",
      "bindSuccess": "成功将 {{count}} 个节点关联到「{{name}}」",
      "bindFailed": "关联失败",
      "unbindNode": "取消关联",
      "unbindSuccess": "已取消「{{name}}」的关联",
      "unbindFailed": "取消关联失败",
      "unbindConfirmTitle": "确认取消关联",
      "unbindConfirmDescription": "将把节点「{{name}}」从当前服务器上解绑（节点本身不会被删除）。",
      "cancel": "取消"
    },
    "messages": {
      "createSuccess": "服务器创建成功",
      "updateSuccess": "服务器更新成功",
      "deleteConfirm": "确认删除服务器？",
      "deleteDescription": "关联节点将自动解绑（不会被删除），此操作不可撤销。",
      "deleteButton": "删除",
      "deleteSuccess": "服务器删除成功",
      "deleteFailed": "删除服务器失败",
      "saveFailed": "保存服务器失败",
      "tokenFetchFailed": "获取令牌失败",
      "tokenResetFailed": "重置令牌失败"
    },
    "nodeForm": {
      "machineId": "绑定服务器",
      "machineIdPlaceholder": "选择一台服务器（可选）",
      "machineIdNone": "独立部署",
      "enabled": "在服务器上激活",
      "enabledDescription": "节点是否在所选服务器上启用运行"
    },
    "nodesStatus": {
      "toggleHint": "在节点管理中修改状态"
    }
  },
  "search": {
    "placeholder": "搜索菜单和功能...",
    "title": "菜单导航",
    "noResults": "未找到结果",
    "shortcut": {
      "label": "搜索",
      "key": "⌘K"
    }
  },
  "knowledge": {
    "title": "知识库管理",
    "description": "在这里可以配置知识库，包括添加、删除、编辑等操作。",
    "columns": {
      "id": "ID",
      "status": "状态",
      "title": "标题",
      "category": "分类",
      "actions": "操作"
    },
    "form": {
      "add": "添加知识",
      "edit": "编辑知识",
      "title": "标题",
      "titlePlaceholder": "请输入知识标题",
      "category": "分类",
      "categoryPlaceholder": "请输入分类，分类将会自动归类",
      "language": "语言",
      "languagePlaceholder": "请选择语言",
      "content": "内容",
      "show": "显示",
      "cancel": "取消",
      "submit": "提交"
    },
    "languages": {
      "en-US": "English",
      "ja-JP": "日本語",
      "ko-KR": "한국어",
      "vi-VN": "Tiếng Việt",
      "zh-CN": "简体中文",
      "zh-TW": "繁體中文",
      "ru-RU": "Русский"
    },
    "messages": {
      "deleteConfirm": "确认删除",
      "deleteDescription": "此操作将永久删除该知识库记录，删除后无法恢复。确定要继续吗？",
      "deleteButton": "删除",
      "operationSuccess": "操作成功",
      "loadError": "加载失败"
    },
    "toolbar": {
      "searchPlaceholder": "搜索知识...",
      "reset": "重置",
      "sortModeHint": "拖拽知识条目进行排序，完成后点击保存",
      "editSort": "编辑排序",
      "saveSort": "保存排序",
      "allCategories": "全部分类"
    }
  },
  "common": {
    "all": "全部",
    "clear": "清除",
    "selectAll": "全选",
    "loading": "加载中...",
    "error": "错误",
    "success": "成功",
    "save": "保存",
    "cancel": "取消",
    "confirm": "确认",
    "close": "关闭",
    "delete": {
      "success": "删除成功",
      "failed": "删除失败"
    },
    "edit": "编辑",
    "view": "查看",
    "toggleNavigation": "切换导航",
    "toggleSidebar": "切换侧边栏",
    "search": "搜索...",
    "noMatch": "无匹配选项",
    "selectField": "选择{{name}}",
    "inputField": "输入{{name}}",
    "pageNotImplemented": "该页面待实现",
    "theme": {
      "label": "主题",
      "light": "浅色",
      "dark": "深色",
      "system": "跟随系统"
    },
    "user": "用户",
    "defaultEmail": "user@example.com",
    "settings": "设置",
    "logout": "退出登录",
    "copy": {
      "success": "复制成功",
      "failed": "复制失败",
      "error": "复制失败",
      "errorLog": "复制到剪贴板时出错"
    },
    "submit": "提交",
    "saving": "保存中...",
    "table": {
      "noData": "暂无数据",
      "pagination": {
        "selected": "已选择 {{selected}} 项，共 {{total}} 项",
        "itemsPerPage": "每页",
        "page": "第",
        "pageOf": "第 {{page}}/{{total}} 页",
        "range": "第 {{from}}–{{to}} 条，共 {{total}} 条",
        "firstPage": "跳转到第一页",
        "previousPage": "上一页",
        "nextPage": "下一页",
        "lastPage": "跳转到最后一页"
      },
      "viewOptions": {
        "button": "显示列",
        "label": "切换显示列"
      }
    },
    "update": {
      "title": "系统更新",
      "newVersion": "发现新版本",
      "currentVersion": "当前版本",
      "latestVersion": "最新版本",
      "updateLater": "稍后更新",
      "updateNow": "立即更新",
      "updating": "更新中...",
      "updateSuccess": "更新成功，系统将在稍后自动重启",
      "updateFailed": "更新失败，请稍后重试"
    },
    "time": {
      "day": "天",
      "hour": "小时"
    },
    "reset": "重置",
    "export": "导出",
    "currency": {
      "yuan": "元"
    },
    "http": {
      "notLoggedIn": "未登录",
      "unknownError": "未知错误",
      "loginExpired": "登录已过期",
      "loginExpiredRelogin": "登录已过期，请重新登录",
      "unauthorized": "未授权，请重新登录",
      "invalidCredentials": "邮箱或密码错误",
      "invalidData": "提交的数据有误，请检查输入",
      "requestFailed": "请求失败",
      "networkError": "网络错误",
      "noPermission": "没有权限",
      "notFound": "资源或接口不存在",
      "unknownException": "未知异常",
      "success": "操作成功"
    },
    "add": "添加",
    "refresh": "刷新",
    "sort": {
      "edit": "编辑排序",
      "done": "完成排序"
    },
    "actions": "操作",
    "start": "起",
    "end": "止"
  },
  "plugin": {
    "title": "插件管理",
    "description": "管理和配置系统插件",
    "search": {
      "placeholder": "搜索插件名称或描述..."
    },
    "type": {
      "placeholder": "选择插件类型",
      "all": "全部类型"
    },
    "tabs": {
      "all": "所有插件",
      "installed": "已安装",
      "available": "可用"
    },
    "status": {
      "enabled": "已启用",
      "disabled": "已禁用",
      "not_installed": "未安装",
      "protected": "受保护",
      "filter_placeholder": "安装状态",
      "all": "全部状态",
      "installed": "已安装",
      "available": "可安装"
    },
    "button": {
      "install": "安装",
      "upgrade": "升级",
      "config": "配置",
      "enable": "启用",
      "disable": "禁用",
      "uninstall": "卸载",
      "readme": "查看文档",
      "menuDemo": "菜单演示"
    },
    "upload": {
      "button": "上传插件",
      "title": "上传插件",
      "description": "上传插件包 (.zip)",
      "dragText": "拖拽插件包到此处，或",
      "clickText": "浏览",
      "supportText": "仅支持 .zip 格式文件",
      "uploading": "上传中...",
      "error": {
        "format": "仅支持 .zip 格式文件"
      }
    },
    "delete": {
      "title": "删除插件",
      "description": "确定要删除此插件吗？此操作无法撤销。",
      "button": "删除"
    },
    "uninstall": {
      "title": "卸载插件",
      "description": "确定要卸载此插件吗？卸载后插件数据将被清除。",
      "button": "卸载"
    },
    "upgrade": {
      "title": "升级插件",
      "description": "确定要升级此插件吗？升级过程中插件将暂时不可用。",
      "button": "升级"
    },
    "config": {
      "title": "配置",
      "description": "修改插件配置",
      "save": "保存",
      "cancel": "取消",
      "noConfigs": "该插件没有可配置的选项",
      "actions": "操作",
      "selectPlan": "请选择套餐",
      "noPlan": "不选择套餐"
    },
    "readme": {
      "title": "插件文档",
      "empty": "暂无文档"
    },
    "author": "作者",
    "messages": {
      "installSuccess": "插件安装成功",
      "installError": "插件安装失败",
      "upgradeSuccess": "插件升级成功",
      "upgradeError": "插件升级失败",
      "uninstallSuccess": "插件卸载成功",
      "uninstallError": "插件卸载失败",
      "enableSuccess": "插件启用成功",
      "enableError": "插件启用失败",
      "disableSuccess": "插件禁用成功",
      "disableError": "插件禁用失败",
      "configLoadError": "加载插件配置失败",
      "configSaveSuccess": "配置保存成功",
      "configSaveError": "配置保存失败",
      "uploadSuccess": "插件上传成功",
      "uploadError": "插件上传失败",
      "deleteSuccess": "插件删除成功",
      "deleteError": "插件删除失败",
      "actionSuccess": "执行成功",
      "actionError": "执行失败",
      "actionLabel": "动作",
      "actionSuccessWithLabel": "{{label}} 执行成功",
      "actionErrorWithLabel": "{{label}} 执行失败",
      "invalidJson": "{{field}} 不是有效的 JSON"
    },
    "staticFiles": {
      "title": "HTML 静态文件",
      "previewTitle": "插件 HTML 预览",
      "backToList": "返回列表",
      "openInNewTab": "新标签页打开",
      "empty": "暂无静态文件"
    },
    "noPlugins": "暂无插件",
    "toolbar": {
      "search": "搜索插件..."
    }
  },
  "dashboard": {
    "title": "仪表盘",
    "stats": {
      "newUsers": "新用户",
      "totalScore": "总积分",
      "monthlyUpload": "月上传",
      "vsLastMonth": "对比上月",
      "vsYesterday": "对比昨日",
      "todayIncome": "今日收入",
      "monthlyIncome": "月收入",
      "totalIncome": "总收入",
      "totalUsers": "总用户",
      "activeUsers": "活跃用户: {{count}}",
      "totalOrders": "总订单",
      "revenue": "收入",
      "todayRegistered": "今日注册",
      "monthlyRegistered": "月注册",
      "onlineUsers": "在线用户",
      "pendingTickets": "待处理工单",
      "hasPendingTickets": "有工单需要处理",
      "noPendingTickets": "无待处理工单",
      "pendingCommission": "待处理佣金",
      "hasPendingCommission": "有佣金需要确认",
      "noPendingCommission": "无待处理佣金",
      "monthlyNewUsers": "月新增用户",
      "monthlyDownload": "月下载",
      "todayTraffic": "今日: {{value}}",
      "activeUserTrend": "活跃用户趋势",
      "realtimeUsers": "实时用户",
      "todayPeak": "今日峰值",
      "vsLastWeek": "对比上周"
    },
    "trafficRank": {
      "nodeTrafficRank": "节点流量排行",
      "userTrafficRank": "用户流量排行",
      "today": "今天",
      "last7days": "最近7天",
      "last30days": "最近30天",
      "customRange": "自定义范围",
      "selectTimeRange": "选择时间范围",
      "selectDateRange": "选择日期范围",
      "currentTraffic": "当前流量",
      "previousTraffic": "上期流量",
      "changeRate": "变化率",
      "recordTime": "记录时间"
    },
    "overview": {
      "title": "收入概览",
      "thisMonth": "本月",
      "lastMonth": "上月",
      "to": "至",
      "selectTimeRange": "选择范围",
      "selectDate": "选择日期",
      "last7Days": "最近7天",
      "last30Days": "最近30天",
      "last90Days": "最近90天",
      "last180Days": "最近180天",
      "lastYear": "最近一年",
      "customRange": "自定义范围",
      "amount": "金额",
      "count": "数量",
      "transactions": "{{count}} 笔交易",
      "orderAmount": "订单金额",
      "commissionAmount": "佣金金额",
      "orderCount": "订单数量",
      "commissionCount": "佣金数量",
      "totalIncome": "总收入",
      "totalCommission": "总佣金",
      "totalTransactions": "共 {{count}} 笔交易",
      "avgOrderAmount": "平均订单金额:",
      "commissionRate": "佣金比例:"
    },
    "queue": {
      "title": "队列状态",
      "metrics": {
        "pending": "待处理 {{count}}",
        "maxWait": "最长等待 {{time}}",
        "backlog": "积压",
        "processes": "进程",
        "pendingLabel": "待处理",
        "wait": "等待"
      },
      "jobDetails": "作业详情",
      "workload": "队列负载",
      "workloadCount": "共 {{count}} 个队列",
      "status": {
        "description": "Horizon 运行状态与各队列积压",
        "running": "运行状态",
        "normal": "正常",
        "abnormal": "异常",
        "waitTime": "当前等待时间：{{seconds}} 秒",
        "pending": "等待中",
        "processing": "处理中",
        "completed": "已完成",
        "failed": "失败",
        "cancelled": "已取消"
      },
      "details": {
        "description": "队列处理详细信息",
        "recentJobs": "近期任务数",
        "statisticsPeriod": "统计时间范围：{{hours}} 小时",
        "jobsPerMinute": "每分钟处理量",
        "maxThroughput": "最高吞吐量：{{value}}",
        "failedJobs7Days": "7日报错数量",
        "retentionPeriod": "保留 {{hours}} 小时",
        "longestRunningQueue": "最长运行队列",
        "activeProcesses": "活跃进程",
        "id": "作业ID",
        "type": "作业类型",
        "status": "状态",
        "progress": "进度",
        "createdAt": "创建时间",
        "updatedAt": "更新时间",
        "error": "错误信息",
        "data": "作业数据",
        "result": "结果",
        "duration": "耗时",
        "attempts": "重试次数",
        "nextRetry": "下次重试",
        "failedJobsDetailTitle": "失败任务详情",
        "viewFailedJobs": "查看报错详情",
        "jobDetailTitle": "任务详细信息",
        "time": "时间",
        "queue": "队列",
        "name": "任务名称",
        "exception": "异常信息",
        "noException": "暂无异常信息",
        "noFailedJobs": "暂无失败任务",
        "connection": "连接类型",
        "payload": "任务数据",
        "viewDetail": "查看详情",
        "action": "操作"
      },
      "actions": {
        "retry": "重试",
        "cancel": "取消",
        "delete": "删除",
        "viewDetails": "查看详情"
      },
      "empty": "队列中暂无作业",
      "loading": "正在加载队列状态...",
      "error": "加载队列状态失败"
    },
    "common": {
      "refresh": "刷新",
      "close": "关闭",
      "pagination": "第 {{current}}/{{total}} 页，共 {{count}} 条"
    },
    "search": {
      "loading": "搜索中...",
      "noResults": "未找到结果",
      "placeholder": "搜索菜单和功能...",
      "title": "菜单导航"
    },
    "traffic": {
      "domain": "域名",
      "monthlyTraffic": "月流量",
      "rank": "排名",
      "title": "流量排行",
      "todayTraffic": "今日流量"
    }
  },
  "order": {
    "title": "订单管理",
    "description": "在这里可以查看用户订单，包括分配、查看、删除等操作。",
    "table": {
      "columns": {
        "tradeNo": "订单号",
        "type": "类型",
        "user": "用户",
        "plan": "订阅计划",
        "period": "周期",
        "amount": "支付金额",
        "status": "订单状态",
        "commission": "佣金",
        "commissionStatus": "佣金状态",
        "createdAt": "创建时间",
        "actions": "操作"
      }
    },
    "type": {
      "NEW": "新购",
      "RENEWAL": "续费",
      "UPGRADE": "升级",
      "RESET_FLOW": "流量重置",
      "DEPOSIT": "余额充值"
    },
    "period": {
      "hour_price": "时付",
      "day_price": "日付",
      "month_price": "月付",
      "quarter_price": "季付",
      "half_year_price": "半年付",
      "year_price": "年付",
      "two_year_price": "两年付",
      "three_year_price": "三年付",
      "onetime_price": "一次性",
      "reset_price": "流量重置包",
      "deposit": "余额充值",
      "hourly": "小时",
      "daily": "天",
      "monthly": "月",
      "quarterly": "季度",
      "half_yearly": "半年",
      "yearly": "年",
      "two_yearly": "两年",
      "three_yearly": "三年",
      "onetime": "一次性",
      "reset_traffic": "重置流量"
    },
    "status": {
      "PENDING": "待支付",
      "PROCESSING": "开通中",
      "CANCELLED": "已取消",
      "COMPLETED": "已完成",
      "DISCOUNTED": "已折抵",
      "tooltip": "标记为[已支付]后将会由系统进行开通后并完成"
    },
    "commission": {
      "PENDING": "待确认",
      "PROCESSING": "发放中",
      "VALID": "有效",
      "INVALID": "无效"
    },
    "filter": {
      "allTypes": "全部类型",
      "allPeriods": "全部周期",
      "allStatuses": "全部状态",
      "allCommissions": "全部佣金状态",
      "userId": "用户 ID",
      "clear": "清除",
      "clearAll": "清除筛选"
    },
    "actions": {
      "view": "查看详情",
      "markAsPaid": "标记为已支付",
      "cancel": "取消订单",
      "issue": "发放佣金",
      "invalid": "无效佣金",
      "openMenu": "打开菜单",
      "reset": "重置",
      "copyTradeNo": "复制订单号"
    },
    "search": {
      "placeholder": "搜索订单号..."
    },
    "dialog": {
      "title": "订单信息",
      "basicInfo": "基本信息",
      "amountInfo": "金额信息",
      "timeInfo": "时间信息",
      "commissionInfo": "佣金信息",
      "commissionStatusActive": "有效",
      "addOrder": "添加订单",
      "assignOrder": "订单分配",
      "fields": {
        "userEmail": "用户邮箱",
        "userPhone": "用户手机号",
        "orderPeriod": "订单周期",
        "subscriptionPlan": "订阅计划",
        "callbackNo": "回调单号",
        "paymentAmount": "支付金额",
        "balancePayment": "余额支付",
        "discountAmount": "优惠金额",
        "refundAmount": "退回金额",
        "deductionAmount": "折抵金额",
        "createdAt": "创建时间",
        "updatedAt": "更新时间",
        "commissionStatus": "佣金状态",
        "commissionAmount": "佣金金额",
        "actualCommissionAmount": "实际佣金",
        "inviteUser": "邀请人",
        "inviteUserId": "邀请人ID"
      },
      "placeholders": {
        "email": "请输入用户邮箱",
        "plan": "请选择订阅计划",
        "period": "请选择购买时长",
        "amount": "请输入需要支付的金额"
      },
      "actions": {
        "cancel": "取消",
        "confirm": "确定"
      },
      "messages": {
        "addSuccess": "添加成功",
        "addOrder": "添加订单"
      }
    },
    "messages": {
      "addSuccess": "添加成功",
      "markPaidSuccess": "已标记为已支付",
      "cancelSuccess": "订单已取消",
      "cancelConfirm": "确认取消该订单？",
      "commissionIssueSuccess": "已发放佣金",
      "commissionInvalidSuccess": "已标记为无效佣金",
      "commissionInvalidConfirm": "确认将该佣金标记为无效？"
    }
  },
  "theme": {
    "title": "主题配置",
    "description": "主题配置，包括主题色、字体大小等。如果你采用前后分离的方式部署V2board，那么主题配置将不会生效。",
    "upload": {
      "button": "上传主题",
      "title": "上传主题",
      "description": "请上传一个有效的主题压缩包（.zip 格式）。主题包应包含完整的主题文件结构。",
      "dragText": "将主题文件拖放到此处，或者",
      "clickText": "点击选择",
      "supportText": "支持 .zip 格式的主题包",
      "uploading": "正在上传...",
      "success": "上传成功",
      "error": {
        "format": "只支持上传 ZIP 格式的主题文件"
      }
    },
    "preview": {
      "title": "主题预览",
      "imageCount": "{{current}} / {{total}}"
    },
    "card": {
      "version": "版本: {{version}}",
      "currentTheme": "当前主题",
      "activateTheme": "激活主题",
      "activateSuccess": "已激活",
      "configureTheme": "主题设置",
      "preview": "预览",
      "delete": {
        "title": "删除主题",
        "description": "确定要删除该主题吗？删除后无法恢复。",
        "button": "删除",
        "error": {
          "active": "不能删除当前使用的主题"
        }
      }
    },
    "config": {
      "title": "配置{{name}}主题",
      "description": "修改主题的样式、布局和其他显示选项。",
      "cancel": "取消",
      "save": "保存",
      "success": "保存成功",
      "noConfigs": "该主题没有可配置的选项",
      "error": "保存失败"
    }
  }
};

window.FBOARD_TRANSLATIONS = window.FBOARD_TRANSLATIONS ?? {};
window.FBOARD_TRANSLATIONS["zh-CN"] = translations;
