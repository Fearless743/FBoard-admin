import type { Translations } from "./global";

const translations: Translations = {
  "giftCard": {
    "title": "禮品卡管理",
    "description": "在這裡可以管理禮品卡模板、兌換碼和使用記錄等功能。",
    "tabs": {
      "templates": "模板管理",
      "codes": "兌換碼管理",
      "usages": "使用記錄",
      "statistics": "統計數據"
    },
    "template": {
      "title": "模板管理",
      "description": "管理禮品卡模板，包括創建、編輯和刪除模板。",
      "table": {
        "title": "模板列表",
        "columns": {
          "id": "ID",
          "name": "名稱",
          "type": "類型",
          "status": "狀態",
          "sort": "排序",
          "rewards": "獎勵內容",
          "created_at": "創建時間",
          "actions": "操作",
          "no_rewards": "無獎勵"
        }
      },
      "form": {
        "add": "添加模板",
        "edit": "編輯模板",
        "name": {
          "label": "模板名稱",
          "placeholder": "請輸入模板名稱",
          "required": "請輸入模板名稱"
        },
        "sort": {
          "label": "排序",
          "placeholder": "數字越小越靠前"
        },
        "type": {
          "label": "類型",
          "placeholder": "請選擇禮品卡類型"
        },
        "description": {
          "label": "描述",
          "placeholder": "請輸入禮品卡描述"
        },
        "status": {
          "label": "狀態",
          "description": "禁用後，此模板將無法生成或兌換新的禮品卡。"
        },
        "display": {
          "title": "顯示效果",
          "theme_color": {
            "label": "主題顏色"
          },
          "icon": {
            "label": "圖標",
            "placeholder": "請輸入圖標的URL"
          },
          "background_image": {
            "label": "背景圖片",
            "placeholder": "請輸入背景圖片的URL"
          }
        },
        "conditions": {
          "title": "使用條件",
          "new_user_max_days": {
            "label": "新用戶註冊天數限制",
            "placeholder": "例如: 7 (僅限註冊7天內的用戶)"
          },
          "new_user_only": {
            "label": "僅限新用戶",
            "hint": "需註冊天數 ≤ {{days}}"
          },
          "paid_user_only": {
            "label": "僅限付費用戶"
          },
          "require_invite": {
            "label": "需要邀請關係"
          },
          "allowed_plans": {
            "label": "允許的套餐",
            "placeholder": "選擇允許兌換的套餐 (留空則不限制)"
          },
          "disallowed_plans": {
            "label": "禁止的套餐",
            "placeholder": "選擇禁止兌換的套餐 (留空則不限制)"
          }
        },
        "limits": {
          "title": "使用限制",
          "max_use_per_user": {
            "label": "單用戶最大使用次數",
            "placeholder": "留空則不限制"
          },
          "cooldown_hours": {
            "label": "同類卡冷卻時間(小時)",
            "placeholder": "留空則不限制"
          }
        },
        "rewards": {
          "title": "獎勵內容",
          "invite_reward_rate": {
            "label": "邀請人獎勵比例",
            "placeholder": "例如: 0.2 (代表20%)",
            "description": "使用者有邀請人時，給邀請人的獎勵 = 餘額獎勵 * 此比例"
          },
          "balance": {
            "label": "獎勵餘額 (元)",
            "short_label": "餘額",
            "placeholder": "請輸入獎勵的金額(元)"
          },
          "transfer_enable": {
            "label": "獎勵流量 (GB)",
            "short_label": "流量",
            "placeholder": "請輸入獎勵的流量(GB)"
          },
          "expire_days": {
            "label": "延長有效期 (天)",
            "short_label": "有效期",
            "placeholder": "請輸入延長的天數"
          },
          "transfer": {
            "label": "獎勵流量 (字節)",
            "placeholder": "請輸入獎勵的流量(字節)"
          },
          "days": {
            "label": "延長有效期 (天)",
            "placeholder": "請輸入延長的天數"
          },
          "device_limit": {
            "label": "增加設備數",
            "short_label": "設備數",
            "placeholder": "請輸入增加的設備數量"
          },
          "reset_package": {
            "label": "重置當月流量",
            "description": "開啟後，兌換時會將用戶當前套餐的已用流量清零。"
          },
          "reset_count": {
            "description": "該類型卡將重置用戶當月的流量使用。"
          },
          "task_card": {
            "description": "任務禮品卡的具體獎勵將在任務系統中配置。"
          },
          "plan_id": {
            "label": "指定套餐",
            "short_label": "套餐",
            "placeholder": "請選擇一個套餐"
          },
          "plan_validity_days": {
            "label": "套餐有效期 (天)",
            "short_label": "套餐有效期",
            "placeholder": "留空則使用套餐默認有效期"
          },
          "random_rewards": {
            "label": "隨機獎勵池",
            "add": "添加隨機獎勵項",
            "weight": "權重"
          }
        },
        "special_config": {
          "title": "特殊配置",
          "start_time": {
            "label": "活動開始時間",
            "placeholder": "請選擇開始日期"
          },
          "end_time": {
            "label": "活動結束時間",
            "placeholder": "請選擇結束日期"
          },
          "festival_bonus": {
            "label": "節日獎勵乘數",
            "placeholder": "例如: 1.5 (代表1.5倍)"
          }
        },
        "submit": {
          "saving": "保存中...",
          "save": "保存"
        }
      },
      "actions": {
        "edit": "編輯",
        "delete": "刪除",
        "deleteConfirm": {
          "title": "確認刪除",
          "description": "此操作將永久刪除該模板，確定要繼續嗎？",
          "confirmText": "刪除"
        }
      }
    },
    "code": {
      "title": "兌換碼管理",
      "form": {
        "generate": "生成兌換碼",
        "template_id": {
          "label": "選擇模板",
          "placeholder": "請選擇一個模板來生成兌換碼"
        },
        "count": {
          "label": "生成數量"
        },
        "prefix": {
          "label": "自定義前綴 (可選)"
        },
        "expires_hours": {
          "label": "有效期 (小時)"
        },
        "max_usage": {
          "label": "最大使用次數"
        },
        "download_csv": "導出CSV",
        "submit": {
          "generating": "生成中...",
          "generate": "立即生成"
        }
      },
      "description": "管理禮品卡兌換碼，包括生成、查看和導出兌換碼。",
      "generate": {
        "title": "生成兌換碼",
        "template": "選擇模板",
        "count": "生成數量",
        "prefix": "自定義前綴",
        "expires_hours": "有效期 (小時)",
        "max_usage": "最大使用次數",
        "submit": "生成"
      },
      "table": {
        "title": "兌換碼列表",
        "columns": {
          "id": "ID",
          "code": "兌換碼",
          "template_name": "模板名稱",
          "status": "狀態",
          "expires_at": "過期時間",
          "usage_count": "已用次數",
          "max_usage": "可用次數",
          "created_at": "創建時間"
        }
      },
      "actions": {
        "enable": "啟用",
        "disable": "禁用",
        "export": "導出",
        "exportConfirm": {
          "title": "確認導出",
          "description": "將導出選定批次的所有兌換碼為文本文件。確定要繼續嗎？",
          "confirmText": "導出"
        }
      },
      "status": {
        "0": "未使用",
        "1": "已使用",
        "2": "已過期",
        "3": "已禁用"
      },
      "edit": {
        "title": "編輯禮品碼",
        "code": "禮品碼",
        "template": "模板",
        "templatePlaceholder": "請選擇模板",
        "maxUsage": "最大使用次數",
        "status": "狀態",
        "expiresAt": "過期時間"
      },
      "messages": {
        "enabled": "已啟用",
        "disabled": "已禁用",
        "exportSuccess": "導出成功",
        "deleteConfirmTitle": "確認刪除",
        "deleteConfirmDescription": "確定要刪除禮品碼 {{code}} 嗎？此操作不可撤銷。",
        "deleteSuccess": "刪除成功",
        "selectTemplate": "請選擇模板",
        "updateSuccess": "更新成功"
      }
    },
    "usage": {
      "title": "使用記錄",
      "description": "查看禮品卡的使用記錄和詳細信息。",
      "table": {
        "columns": {
          "id": "ID",
          "code": "兌換碼",
          "template_name": "模板名稱",
          "user_email": "用戶郵箱",
          "rewards_given": "獲得獎勵",
          "invite_rewards": "邀請獎勵",
          "multiplier_applied": "倍數加成",
          "ip_address": "IP地址",
          "created_at": "使用時間",
          "actions": "操作"
        }
      },
      "actions": {
        "view": "查看詳情"
      }
    },
    "statistics": {
      "title": "統計數據",
      "description": "查看禮品卡的統計數據和使用情況分析。",
      "total": {
        "title": "總體統計",
        "templates_count": "模板總數",
        "active_templates_count": "活躍模板數",
        "codes_count": "兌換碼總數",
        "used_codes_count": "已使用兌換碼",
        "usages_count": "使用記錄數"
      },
      "daily": {
        "title": "每日使用量",
        "chart": "使用量趨勢圖"
      },
      "type": {
        "title": "類型統計",
        "chart": "類型分佈圖"
      },
      "dateRange": {
        "label": "日期範圍",
        "start": "開始日期",
        "end": "結束日期"
      }
    },
    "types": {
      "1": "通用禮品卡",
      "2": "套餐禮品卡",
      "3": "盲盒禮品卡",
      "4": "任務禮品卡"
    },
    "common": {
      "search": "搜索禮品卡...",
      "reset": "重置",
      "filter": "篩選",
      "export": "導出",
      "refresh": "刷新",
      "back": "返回",
      "close": "關閉",
      "confirm": "確認",
      "cancel": "取消",
      "enabled": "已啟用",
      "disabled": "已禁用",
      "loading": "加載中...",
      "noData": "暫無數據",
      "success": "操作成功",
      "error": "操作失敗"
    },
    "messages": {
      "formInvalid": "請檢查表單輸入是否正確",
      "templateCreated": "模板創建成功",
      "templateUpdated": "模板更新成功",
      "templateDeleted": "模板刪除成功",
      "codeGenerated": "兌換碼生成成功",
      "generateCodeFailed": "兌換碼生成失敗",
      "codeStatusUpdated": "兌換碼狀態更新成功",
      "updateCodeStatusFailed": "兌換碼狀態更新失敗",
      "codesExported": "兌換碼導出成功",
      "createTemplateFailed": "創建模板失敗",
      "updateTemplateFailed": "更新模板失敗",
      "deleteTemplateFailed": "刪除模板失敗",
      "loadDataFailed": "加載數據失敗",
      "codesGenerated": "兌換碼生成成功"
    }
  },
  "user": {
    "manage": {
      "title": "用戶管理",
      "description": "在這裡可以管理用戶，包括增加、刪除、編輯、查詢等操作。"
    },
    "columns": {
      "is_admin": "管理員",
      "is_staff": "員工",
      "id": "ID",
      "email": "郵箱",
      "online_count": "在線設備",
      "status": "狀態",
      "subscription": "訂閱",
      "group": "權限組",
      "used_traffic": "已用流量",
      "total_traffic": "總流量",
      "expire_time": "到期時間",
      "balance": "餘額",
      "commission": "佣金",
      "register_time": "註冊時間",
      "invitee_email": "邀請用戶",
      "actions": "操作",
      "next_reset_at": "下次重置時間",
      "device_limit": {
        "unlimited": "無設備數限制",
        "limited": "最多可同時在線 {{count}} 臺設備"
      },
      "status_text": {
        "normal": "正常",
        "banned": "已封禁"
      },
      "online_status": {
        "online": "當前在線",
        "never": "從未在線",
        "last_online": "最後在線時間: {{time}}",
        "offline_duration": {
          "days": "離線時長: {{count}}天",
          "hours": "離線時長: {{count}}小時",
          "minutes": "離線時長: {{count}}分鐘",
          "seconds": "離線時長: {{count}}秒"
        }
      },
      "expire_status": {
        "permanent": "長期有效",
        "expired": "已過期 {{days}} 天",
        "remaining": "剩餘 {{days}} 天"
      },
      "copy_email": "複製郵箱",
      "actions_menu": {
        "edit": "編輯",
        "view_details": "查看詳情",
        "assign_order": "分配訂單",
        "copy_url": "複製訂閱URL",
        "reset_secret": "重置UUID及訂閱URL",
        "reset_traffic": "重置流量",
        "orders": "TA的訂單",
        "invites": "TA的邀請",
        "traffic_records": "TA的流量記錄",
        "login_history": "登錄歷史",
        "delete": "刪除",
        "delete_confirm_title": "確認刪除用戶",
        "delete_confirm_description": "此操作將永久刪除用戶 {{email}} 及其所有相關數據，包括訂單、優惠碼、流量記錄、工單記錄等信息。刪除後無法恢復，是否繼續？"
      }
    },
    "filter": {
      "selected": "已選擇 {{count}} 項",
      "clear_selection": "取消選擇",
      "no_results": "未找到結果",
      "clear": "清除篩選",
      "search_placeholder": "搜索...",
      "email_search": "搜索用戶郵箱...",
      "advanced": "高級篩選",
      "reset": "重置篩選",
      "sheet": {
        "title": "高級篩選",
        "description": "添加一個或多個篩選條件來精確查找用戶",
        "conditions": "篩選條件",
        "add": "添加條件",
        "condition": "條件 {{number}}",
        "field": "選擇字段",
        "operator": "選擇操作符",
        "value": "輸入值",
        "value_number": "輸入數值({{unit}})",
        "reset": "重置",
        "apply": "應用篩選"
      },
      "fields": {
        "email": "郵箱",
        "phone": "手機號",
        "id": "用戶ID",
        "plan_id": "訂閱",
        "transfer_enable": "流量",
        "total_used": "已用流量",
        "online_count": "在線設備",
        "expired_at": "到期時間",
        "uuid": "UUID",
        "token": "Token",
        "banned": "賬號狀態",
        "remark": "備註",
        "inviter_email": "邀請人郵箱",
        "invite_user_id": "邀請人ID",
        "is_admin": "管理員",
        "is_staff": "員工"
      },
      "operators": {
        "contains": "包含",
        "eq": "等於",
        "gt": "大於",
        "lt": "小於"
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
      "button": "創建用戶",
      "title": "創建用戶",
      "description_single": "創建單個指定郵箱賬號",
      "description_batch": "批量生成隨機郵箱賬號",
      "form": {
        "email": "郵箱",
        "email_prefix": "帳號(批量生成請留空)",
        "email_prefix_placeholder": "留空則批量隨機",
        "email_domain": "域",
        "password": "密碼",
        "password_placeholder": "留空則密碼與郵件相同",
        "expire_time": "到期時間",
        "expire_time_placeholder": "請選擇用戶到期日期，留空為長期有效",
        "permanent": "長期有效",
        "subscription": "訂閱計劃",
        "subscription_none": "無",
        "generate_count": "生成數量",
        "generate_count_placeholder": "如果為批量生產請輸入生成數量",
        "cancel": "取消",
        "submit": "生成",
        "success": "生成成功",
        "download_csv": "導出為 CSV 文件",
        "generated_count": "已生成 {{count}} 個賬號",
        "single_success_hint": "賬號已創建，可在用戶列表中查看與編輯。",
        "copy_all": "複製全部",
        "copy_email": "複製郵箱",
        "copy_subscribe": "複製訂閱",
        "result_password": "密碼",
        "result_expire": "到期"
      },
      "copy_line": {
        "email": "郵箱: {{value}}",
        "password": "密碼: {{value}}",
        "expire": "到期: {{value}}",
        "subscribe": "訂閱: {{value}}"
      },
      "csv": {
        "email": "郵箱",
        "password": "密碼",
        "expire_time": "到期時間",
        "uuid": "UUID",
        "created_at": "創建時間",
        "subscribe_url": "訂閱地址"
      }
    },
    "edit": {
      "button": "編輯用戶信息",
      "title": "用戶管理",
      "form": {
        "email": "郵箱",
        "phone_country": "國家/地區",
        "phone": "手機號",
        "phone_placeholder": "請輸入手機號",
        "email_placeholder": "請輸入郵箱",
        "inviter_email": "邀請人郵箱",
        "inviter_email_placeholder": "請輸入郵箱",
        "invite_user_id": "邀請人ID",
        "invite_user_id_placeholder": "請輸入邀請人用戶ID，留空則清空",
        "password": "密碼",
        "password_placeholder": "如需修改密碼請輸入",
        "balance": "餘額",
        "balance_placeholder": "請輸入餘額",
        "commission_balance": "佣金餘額",
        "commission_balance_placeholder": "請輸入佣金餘額",
        "upload": "已用上行",
        "upload_placeholder": "已用上行",
        "download": "已用下行",
        "download_placeholder": "已用下行",
        "total_traffic": "流量",
        "total_traffic_placeholder": "請輸入流量",
        "expire_time": "到期時間",
        "expire_time_placeholder": "請選擇用戶到期日期，留空為長期有效",
        "expire_time_specific": "具體時間",
        "expire_time_today": "設為當天結束",
        "expire_time_permanent": "長期有效",
        "expire_time_1month": "一個月",
        "expire_time_3months": "三個月",
        "expire_time_confirm": "確定",
        "subscription": "訂閱計劃",
        "subscription_none": "無",
        "account_status": "賬戶狀態",
        "banned_hint": "用戶無法登錄、無法使用訂閱服務",
        "normal_hint": "用戶可以正常使用所有服務",
        "commission_type": "佣金類型",
        "commission_type_system": "跟隨系統設置",
        "commission_type_cycle": "循環返利",
        "commission_type_onetime": "首次返利",
        "commission_rate": "推薦返利比例",
        "commission_rate_placeholder": "為空則跟隨站點設置返利比例",
        "discount": "專享折扣比例",
        "discount_placeholder": "為空則不享受專享折扣",
        "speed_limit": "限速",
        "speed_limit_placeholder": "留空則不限速",
        "device_limit": "設備限制",
        "device_limit_placeholder": "留空則不限制",
        "is_admin": "是否管理員",
        "is_staff": "是否員工",
        "remarks": "備註",
        "remarks_placeholder": "請在這裡記錄",
        "cancel": "取消",
        "submit": "提交",
        "success": "修改成功"
      }
    },
    "actions": {
      "title": "操作",
      "send_email": "發送郵件",
      "export_csv": "導出 CSV",
      "traffic_reset_stats": "流量重置統計",
      "batch_ban": "批量封禁",
      "confirm_ban": {
        "title": "確認批量封禁",
        "filtered_description": "此操作將封禁所有符合當前篩選條件的用戶。此操作無法撤銷。",
        "all_description": "此操作將封禁系統中的所有用戶。此操作無法撤銷。",
        "cancel": "取消",
        "confirm": "確認封禁",
        "banning": "封禁中..."
      }
    },
    "traffic_reset": {
      "title": "流量重置",
      "description": "為用戶 {{email}} 重置流量使用量",
      "tabs": {
        "reset": "重置流量",
        "history": "重置歷史"
      },
      "user_info": "用戶信息",
      "warning": {
        "title": "重要提醒",
        "irreversible": "流量重置操作不可逆，請謹慎操作",
        "reset_to_zero": "重置後用戶的上傳和下載流量將清零",
        "logged": "所有重置操作都會被記錄在系統日誌中"
      },
      "reason": {
        "label": "重置原因",
        "placeholder": "請輸入重置流量的原因（可選）",
        "optional": "此字段為可選項，用於記錄重置原因"
      },
      "confirm_reset": "確認重置",
      "resetting": "重置中...",
      "reset_success": "流量重置成功",
      "reset_failed": "流量重置失敗",
      "history": {
        "summary": "重置概覽",
        "reset_count": "重置次數",
        "last_reset": "最後重置",
        "next_reset": "下次重置",
        "never": "從未重置",
        "no_schedule": "無定時重置",
        "records": "重置記錄",
        "recent_records": "最近10次重置記錄",
        "no_records": "暫無重置記錄",
        "reset_time": "重置時間",
        "traffic_cleared": "清除流量"
      },
      "stats": {
        "title": "流量重置統計",
        "description": "查看系統流量重置的統計信息",
        "time_range": "統計時間範圍",
        "total_resets": "總重置次數",
        "auto_resets": "自動重置",
        "manual_resets": "手動重置",
        "cron_resets": "定時重置",
        "in_period": "最近 {{days}} 天",
        "breakdown": "重置類型分佈",
        "breakdown_description": "各類型重置操作的百分比分佈",
        "auto_percentage": "自動重置佔比",
        "manual_percentage": "手動重置佔比",
        "cron_percentage": "定時重置佔比",
        "days_options": {
          "week": "最近一週",
          "month": "最近一月",
          "quarter": "最近三月",
          "year": "最近一年"
        }
      }
    },
    "traffic_reset_logs": {
      "title": "流量重置日誌",
      "description": "查看系統中所有流量重置操作的詳細記錄",
      "columns": {
        "id": "日誌ID",
        "user": "用戶",
        "reset_type": "重置類型",
        "trigger_source": "觸發源",
        "cleared_traffic": "清除流量",
        "cleared": "已清除",
        "upload": "上傳",
        "download": "下載",
        "reset_time": "重置時間",
        "log_time": "記錄時間"
      },
      "filters": {
        "search_user": "搜索用戶郵箱...",
        "reset_type": "重置類型",
        "trigger_source": "觸發源",
        "all_types": "全部類型",
        "all_sources": "全部來源",
        "start_date": "開始日期",
        "end_date": "結束日期",
        "apply_date": "應用篩選",
        "reset": "重置篩選",
        "filter_title": "篩選條件",
        "filter_description": "設置篩選條件來查找特定的流量重置記錄",
        "reset_types": {
          "monthly": "按月重置",
          "first_day_month": "每月1號重置",
          "yearly": "按年重置",
          "first_day_year": "每年1月1日重置",
          "manual": "手動重置"
        },
        "trigger_sources": {
          "auto": "自動觸發",
          "manual": "手動觸發",
          "cron": "定時任務"
        }
      },
      "actions": {
        "export": "導出日誌",
        "exporting": "導出中...",
        "export_success": "導出成功",
        "export_failed": "導出失敗"
      },
      "trigger_descriptions": {
        "manual": "管理員手動執行的流量重置",
        "cron": "系統定時任務自動執行",
        "auto": "系統根據條件自動觸發",
        "other": "其他方式觸發"
      }
    },
    "login_history": {
      "title": "登錄歷史",
      "no_records": "暫無登錄記錄",
      "columns": {
        "time": "時間",
        "ip": "IP",
        "method": "方式",
        "user_agent": "User-Agent"
      },
      "methods": {
        "password": "密碼登錄",
        "register": "註冊",
        "mail_link": "郵件鏈接"
      }
    },
    "messages": {
      "success": "成功",
      "error": "錯誤",
      "export": {
        "success": "導出成功",
        "failed": "導出失敗"
      },
      "batch_ban": {
        "success": "批量封禁成功",
        "failed": "批量封禁失敗"
      },
      "send_mail": {
        "success": "郵件發送成功",
        "failed": "郵件發送失敗",
        "required_fields": "請填寫所有必填字段"
      },
      "reset_secret": {
        "success": "UUID & Token 已重置"
      }
    },
    "send_mail": {
      "title": "發送郵件",
      "description": "向所選或已篩選的用戶發送郵件",
      "subject": "主題",
      "content": "內容",
      "sending": "發送中...",
      "send": "發送"
    },
    "dialog": {
      "title": "用戶詳情",
      "basicInfo": "基本信息",
      "subscriptionInfo": "訂閱信息",
      "trafficInfo": "流量信息",
      "financialInfo": "財務信息",
      "activityInfo": "活動信息",
      "inviteInfo": "邀請信息",
      "timeInfo": "時間信息",
      "subscriptionUrl": "訂閱鏈接",
      "fields": {
        "userId": "用戶ID",
        "email": "郵箱",
        "phone": "手機號",
        "uuid": "UUID",
        "token": "Token",
        "remarks": "備註",
        "subscriptionPlan": "訂閱套餐",
        "permissionGroup": "權限組",
        "expiredAt": "到期時間",
        "deviceLimit": "設備限制",
        "speedLimit": "速度限制",
        "transferEnable": "總流量",
        "uploadUsed": "上傳已用",
        "downloadUsed": "下載已用",
        "totalUsed": "總已用",
        "lastResetAt": "上次重置",
        "nextResetAt": "下次重置",
        "resetCount": "重置次數",
        "balance": "餘額",
        "commissionBalance": "佣金餘額",
        "commissionType": "佣金類型",
        "commissionRate": "佣金比例",
        "lastLoginAt": "最後登錄",
        "lastLoginIp": "最後登錄IP",
        "registerIp": "註冊IP",
        "lastOnlineAt": "最後在線",
        "onlineCount": "在線設備",
        "inviteUser": "邀請人",
        "inviteUserId": "邀請人ID",
        "createdAt": "創建時間",
        "updatedAt": "更新時間",
        "subscribeUrl": "訂閱鏈接",
        "telegramId": "Telegram ID"
      }
    },
    "status": {
      "normal": "正常",
      "banned": "已封禁",
      "admin": "管理員",
      "staff": "員工"
    }
  },
  "nav": {
    "dashboard": "儀表盤",
    "systemManagement": "系統管理",
    "systemConfig": "系統配置",
    "themeConfig": "主題配置",
    "pluginManagement": "插件管理",
    "pluginMenuDemo": "插件菜單（演示）",
    "noticeManagement": "公告管理",
    "paymentConfig": "支付配置",
    "knowledgeManagement": "知識庫管理",
    "nodeManagement": "節點管理",
    "machineManagement": "服務器管理",
    "permissionGroupManagement": "權限組管理",
    "routeManagement": "路由管理",
    "subscriptionManagement": "訂閱管理",
    "planManagement": "套餐管理",
    "orderManagement": "訂單管理",
    "couponManagement": "優惠券管理",
    "giftCardManagement": "禮品卡管理",
    "userManagement": "用戶管理",
    "ticketManagement": "工單管理",
    "withdrawalManagement": "提现管理",
    "trafficResetLogs": "流量重置日誌",
    "pluginApps": "插件應用"
  },
  "subscribe": {
    "plan": {
      "title": "訂閱套餐",
      "add": "添加套餐",
      "search": "搜索套餐...",
      "sort": {
        "edit": "編輯排序",
        "save": "保存排序"
      },
      "columns": {
        "id": "ID",
        "show": "顯示",
        "sell": "新購",
        "renew": "續費",
        "renew_tooltip": "在訂閱停止銷售時，已購用戶是否可以續費",
        "name": "名稱",
        "users": "總用戶",
        "active_users": "活躍用戶",
        "stats": "統計",
        "group": "權限組",
        "price": "價格",
        "actions": "操作",
        "edit": "編輯",
        "delete": "刪除",
        "delete_confirm": {
          "title": "確認刪除",
          "description": "此操作將永久刪除該訂閱，刪除後無法恢復。確定要繼續嗎？",
          "success": "刪除成功"
        },
        "price_period": {
          "hourly": "時付",
          "daily": "日付",
          "monthly": "月付",
          "quarterly": "季付",
          "half_yearly": "半年付",
          "yearly": "年付",
          "two_yearly": "兩年付",
          "three_yearly": "三年付",
          "onetime": "流量包",
          "reset_traffic": "重置包",
          "no_price": "無價格",
          "unit": {
            "hour": "元/時",
            "day": "元/天",
            "month": "元/月",
            "quarter": "元/季",
            "half_year": "元/半年",
            "year": "元/年",
            "two_year": "元/兩年",
            "three_year": "元/三年",
            "times": "元/次"
          }
        }
      },
      "form": {
        "add_title": "添加套餐",
        "edit_title": "編輯套餐",
        "name": {
          "label": "套餐名稱",
          "placeholder": "請輸入套餐名稱",
          "required": "請輸入套餐名稱"
        },
        "group": {
          "label": "權限組",
          "add": "添加權限組",
          "placeholder": "請選擇權限組",
          "none": "不綁定權限組"
        },
        "transfer": {
          "label": "流量",
          "placeholder": "請輸入流量限制",
          "unit": "GB",
          "hint": "套餐包含的流量配額，單位為 GB"
        },
        "speed": {
          "label": "速度限制",
          "placeholder": "0 表示不限制",
          "unit": "Mbps",
          "hint": "單用戶限速，0 或留空表示不限制"
        },
        "price": {
          "title": "價格設置",
          "base_price": "基礎價格",
          "clear": {
            "button": "清空",
            "tooltip": "清空所有價格"
          },
          "period": {
            "monthly": "每月",
            "months": "{{count}}個月"
          },
          "onetime_desc": "一次性流量包，無時間限制",
          "reset_desc": "重置流量包，可多次使用"
        },
        "device": {
          "label": "設備限制",
          "placeholder": "0 表示不限制",
          "unit": "臺",
          "hint": "同時在線設備數，0 或留空表示不限制"
        },
        "capacity": {
          "label": "容量限制",
          "placeholder": "0 表示不限制",
          "unit": "人",
          "hint": "可售賣名額上限，0 或留空表示不限制"
        },
        "tags": {
          "label": "標籤",
          "placeholder": "輸入標籤後按回車確認"
        },
        "reset_method": {
          "label": "流量重置方式",
          "placeholder": "請選擇重置方式",
          "description": "流量重置方式將決定如何重置流量",
          "options": {
            "follow_system": "跟隨系統設置",
            "monthly_first": "每月首日",
            "monthly_reset": "每月購買日",
            "no_reset": "不重置",
            "yearly_first": "每年首日",
            "yearly_reset": "每年購買日"
          }
        },
        "content": {
          "label": "套餐說明",
          "placeholder": "請輸入套餐說明",
          "description": "支持 Markdown 格式",
          "preview": "預覽",
          "preview_button": {
            "show": "顯示預覽",
            "hide": "隱藏預覽"
          },
          "template": {
            "button": "使用模板",
            "tooltip": "使用默認模板",
            "content": "## 套餐詳情\n\n- 流量：{{transfer}} GB\n- 速度限制：{{speed}} Mbps\n- 同時在線設備：{{devices}} 臺\n\n## 服務說明\n\n1. 流量{{reset_method}}重置\n2. 支持多平臺使用\n3. 7×24小時技術支持"
          }
        },
        "section": {
          "basic": "基本信息",
          "limits": "配額與限制",
          "content": "套餐說明",
          "status": "上架狀態"
        },
        "status": {
          "show_desc": "在前臺套餐列表中展示",
          "sell_desc": "允許新用戶購買此套餐",
          "renew_desc": "允許已有用戶續費此套餐"
        },
        "force_update": {
          "label": "強制更新用戶套餐",
          "description": "開啟後保存時會將該套餐下用戶的權限組、流量、限速與設備數強制同步到當前值，僅在編輯已有套餐時生效。"
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
            "validation": "表單校驗失敗，請檢查並修正錯誤後重試。"
          }
        }
      },
      "page": {
        "description": "在這裡可以配置訂閱計劃，包括添加、刪除、編輯等操作。"
      }
    }
  },
  "settings": {
    "title": "系統設置",
    "description": "管理系統核心配置，包括站點、安全、訂閱、邀請佣金、節點、郵件和通知等設置",
    "site": {
      "title": "站點設置",
      "description": "配置站點基本信息，包括站點名稱、描述、貨幣單位等核心設置。",
      "form": {
        "siteName": {
          "label": "站點名稱",
          "placeholder": "請輸入站點名稱",
          "description": "用於顯示需要站點名稱的地方。"
        },
        "logo": {
          "label": "站點 LOGO",
          "placeholder": "請輸入LOGO URL，末尾不要/",
          "description": "用於顯示需要LOGO的地方。"
        },
        "siteDescription": {
          "label": "站點描述",
          "placeholder": "請輸入站點描述",
          "description": "用於顯示需要站點描述的地方。"
        },
        "siteUrl": {
          "label": "站點網址",
          "placeholder": "請輸入站點URL，末尾不要/",
          "description": "當前網站最新網址，將會在郵件等需要用於網址處體現。"
        },
        "forceHttps": {
          "label": "強制HTTPS",
          "description": "當站點沒有使用HTTPS，CDN或反代開啟強制HTTPS時需要開啟。"
        },
        "maintenanceMode": {
          "label": "維護模式",
          "description": "開啟後普通用戶的狀態變更和代理流量將暫停，管理員仍可進入後臺關閉維護模式。"
        },
        "subscribeUrl": {
          "label": "訂閱URL",
          "placeholder": "用於訂閱所使用，多個訂閱地址用','隔開.留空則為站點URL。",
          "description": "用於訂閱所使用，留空則為站點URL。"
        },
        "tosUrl": {
          "label": "用戶條款(TOS)URL",
          "placeholder": "請輸入用戶條款URL，末尾不要/",
          "description": "用於跳轉到用戶條款(TOS)"
        },
        "stopRegister": {
          "label": "停止新用戶註冊",
          "description": "開啟後任何人都將無法進行註冊。"
        },
        "ticketMustWaitReply": {
          "label": "工單等待回覆限制",
          "description": "開啟後，用戶在管理員回覆前無法在同一工單內連續發送消息。"
        },
        "tryOut": {
          "label": "註冊試用套餐",
          "placeholder": "請選擇套餐",
          "description": "選擇需要試用的訂閱，如果沒有選項請先前往訂閱管理添加。",
          "no_plan": "關閉",
          "duration": {
            "label": "註冊試用時長",
            "placeholder": "0",
            "description": "註冊試用時長，單位為小時。"
          }
        },
        "currency": {
          "label": "貨幣單位",
          "placeholder": "CNY",
          "description": "僅用於展示使用，更改後系統中所有的貨幣單位都將發生變更。"
        },
        "currencySymbol": {
          "label": "貨幣符號",
          "placeholder": "¥",
          "description": "僅用於展示使用，更改後系統中所有的貨幣單位都將發生變更。"
        }
      }
    },
    "safe": {
      "title": "安全設置",
      "description": "配置系統安全相關選項，包括登錄驗證、密碼策略、API訪問等安全設置。",
      "form": {
        "emailVerify": {
          "label": "郵箱驗證",
          "description": "開啟後將會強制要求用戶進行郵箱驗證。"
        },
        "gmailLimit": {
          "label": "禁止使用Gmail多別名",
          "description": "開啟後Gmail多別名將無法註冊。"
        },
        "safeMode": {
          "label": "安全模式",
          "description": "開啟後除了站點URL以外的綁定本站點的域名訪問都將會被403。"
        },
        "securePath": {
          "label": "後臺路徑",
          "placeholder": "admin",
          "description": "後臺管理路徑，修改後將會改變原有的admin路徑"
        },
        "emailWhitelist": {
          "label": "郵箱後綴白名單",
          "description": "開啟後在名單中的郵箱後綴才允許進行註冊。",
          "suffixes": {
            "label": "郵箱後綴",
            "placeholder": "輸入郵箱後綴，每行一個",
            "description": "輸入允許的郵箱後綴，每行一個"
          }
        },
        "captcha": {
          "enable": {
            "label": "啟用驗證碼",
            "description": "開啟後用戶註冊時需要通過驗證碼驗證。"
          },
          "type": {
            "label": "驗證碼類型",
            "description": "選擇要使用的驗證碼服務類型",
            "options": {
              "recaptcha": "Google reCAPTCHA v2",
              "recaptcha-v3": "Google reCAPTCHA v3",
              "turnstile": "Cloudflare Turnstile"
            }
          },
          "recaptcha": {
            "key": {
              "label": "reCAPTCHA密鑰",
              "placeholder": "輸入reCAPTCHA密鑰",
              "description": "輸入您的reCAPTCHA密鑰"
            },
            "siteKey": {
              "label": "reCAPTCHA站點密鑰",
              "placeholder": "輸入reCAPTCHA站點密鑰",
              "description": "輸入您的reCAPTCHA站點密鑰"
            }
          },
          "recaptcha_v3": {
            "secretKey": {
              "label": "reCAPTCHA v3密鑰",
              "placeholder": "輸入reCAPTCHA v3密鑰",
              "description": "輸入您的reCAPTCHA v3服務器密鑰"
            },
            "siteKey": {
              "label": "reCAPTCHA v3站點密鑰",
              "placeholder": "輸入reCAPTCHA v3站點密鑰",
              "description": "輸入您的reCAPTCHA v3站點密鑰"
            },
            "scoreThreshold": {
              "label": "分數閾值",
              "placeholder": "0.5",
              "description": "設置驗證分數閾值（0-1），分數越高表示越可能是真人操作"
            }
          },
          "turnstile": {
            "secretKey": {
              "label": "Turnstile密鑰",
              "placeholder": "輸入Turnstile密鑰",
              "description": "輸入您的Cloudflare Turnstile密鑰"
            },
            "siteKey": {
              "label": "Turnstile站點密鑰",
              "placeholder": "輸入Turnstile站點密鑰",
              "description": "輸入您的Cloudflare Turnstile站點密鑰"
            }
          }
        },
        "registerLimit": {
          "enable": {
            "label": "IP註冊限制",
            "description": "開啟後將限制同一IP的註冊次數。"
          },
          "count": {
            "label": "註冊次數",
            "placeholder": "輸入最大註冊次數",
            "description": "同一IP允許的最大註冊次數"
          },
          "expire": {
            "label": "限制時長",
            "placeholder": "輸入限制時長（分鐘）",
            "description": "註冊限制的持續時間（分鐘）"
          }
        },
        "passwordLimit": {
          "enable": {
            "label": "密碼嘗試限制",
            "description": "開啟後將限制密碼嘗試次數。"
          },
          "count": {
            "label": "嘗試次數",
            "placeholder": "輸入最大嘗試次數",
            "description": "允許的最大密碼嘗試次數"
          },
          "expire": {
            "label": "鎖定時長",
            "placeholder": "輸入鎖定時長（分鐘）",
            "description": "賬戶鎖定的持續時間（分鐘）"
          }
        }
      }
    },
    "subscribe": {
      "title": "訂閱設置",
      "description": "管理用戶訂閱相關配置，包括訂閱鏈接格式、更新頻率、流量統計等設置。",
      "plan_change_enable": {
        "title": "允許用戶更改訂閱",
        "description": "開啟後用戶將會可以對訂閱計劃進行變更。"
      },
      "reset_traffic_method": {
        "title": "月流量重置方式",
        "description": "全局流量重置方式，默認每月1號。可以在訂閱管理為訂閱單獨設置。",
        "options": {
          "monthly_first": "每月1號",
          "monthly_reset": "按月重置",
          "no_reset": "不重置",
          "yearly_first": "每年1月1號",
          "yearly_reset": "按年重置"
        }
      },
      "surplus_enable": {
        "title": "開啟折抵方案",
        "description": "開啟後用戶更換訂閱將會由系統對原有訂閱進行折抵，方案參考文檔。"
      },
      "new_order_event": {
        "title": "當訂閱新購時觸發事件",
        "description": "新購訂閱完成時將觸發該任務。",
        "options": {
          "no_action": "不執行任何動作",
          "reset_traffic": "重置用戶流量"
        }
      },
      "renew_order_event": {
        "title": "當訂閱續費時觸發事件",
        "description": "續費訂閱完成時將觸發該任務。",
        "options": {
          "no_action": "不執行任何動作",
          "reset_traffic": "重置用戶流量"
        }
      },
      "change_order_event": {
        "title": "當訂閱變更時觸發事件",
        "description": "變更訂閱完成時將觸發該任務。",
        "options": {
          "no_action": "不執行任何動作",
          "reset_traffic": "重置用戶流量"
        }
      },
      "subscribe_path": {
        "title": "訂閱路徑",
        "description": "訂閱路徑，修改後將會改變原有的subscribe路徑",
        "current_format": "當前訂閱路徑格式：{path}/xxxxxxxxxx",
        "restart_tip": "修改訂閱路徑後，可能需要重啟服務才能生效。"
      },
      "show_info_to_server": {
        "title": "在訂閱中展示訂閱信息",
        "description": "開啟後將會在用戶訂閱節點時輸出訂閱信息。"
      },
      "show_protocol_to_server": {
        "title": "在訂閱中線路名稱中顯示協議名稱",
        "description": "開啟後訂閱線路會附帶協議名稱（例如: [Hy2]香港）"
      },
      "default_remind_expire": {
        "title": "新用戶默認開啟到期提醒",
        "description": "開啟後新註冊用戶默認啟用訂閱到期提醒，可在用戶管理單獨調整。"
      },
      "default_remind_traffic": {
        "title": "新用戶默認開啟流量提醒",
        "description": "開啟後新註冊用戶默認啟用流量不足提醒，可在用戶管理單獨調整。"
      },
      "deposit_enable": {
        "title": "開啟餘額充值",
        "description": "開啟後用戶可在前台建立餘額充值訂單並完成支付入帳。"
      },
      "deposit_commission_enable": {
        "title": "餘額充值參與邀請返佣",
        "description": "開啟後餘額充值訂單將依邀請規則計算佣金。"
      },
      "deposit_min_amount": {
        "title": "最低充值金額（分）",
        "description": "用戶單筆充值的最低金額，單位為分。例如 100 表示 1 元。",
        "placeholder": "100"
      },
      "deposit_max_amount": {
        "title": "最高充值金額（分）",
        "description": "用戶單筆充值的最高金額，單位為分。",
        "placeholder": "999999900"
      },
      "deposit_bonus": {
        "title": "充值贈送階梯",
        "description": "格式為「門檻元:贈送元」，例如 100:10 表示充值滿 100 元贈送 10 元。取滿足門檻的最大贈送。",
        "placeholder": "100:10"
      },
      "saving": "保存中...",
      "plan": {
        "title": "訂閱套餐",
        "add": "添加套餐",
        "search": "搜索套餐...",
        "sort": {
          "edit": "編輯排序",
          "save": "保存排序"
        },
        "columns": {
          "id": "編號",
          "show": "顯示",
          "sell": "新購",
          "renew": "續費",
          "renew_tooltip": "在訂閱停止銷售時，已購用戶是否可以續費",
          "name": "名稱",
          "stats": "統計",
          "group": "權限組",
          "price": "價格",
          "actions": "操作",
          "edit": "編輯",
          "delete": "刪除",
          "delete_confirm": {
            "title": "確認刪除",
            "description": "此操作將永久刪除該訂閱，刪除後無法恢復。確定要繼續嗎？",
            "success": "刪除成功"
          },
          "price_period": {
            "hourly": "時付",
            "daily": "日付",
            "monthly": "月付",
            "quarterly": "季付",
            "half_yearly": "半年付",
            "yearly": "年付",
            "two_yearly": "兩年付",
            "three_yearly": "三年付",
            "onetime": "流量包",
            "reset_traffic": "重置包",
            "unit": {
              "hour": "元/時",
              "day": "元/天",
              "month": "元/月",
              "quarter": "元/季",
              "half_year": "元/半年",
              "year": "元/年",
              "two_year": "元/兩年",
              "three_year": "元/三年",
              "times": "元/次"
            }
          }
        },
        "form": {
          "add_title": "添加套餐",
          "edit_title": "編輯套餐",
          "name": {
            "label": "套餐名稱",
            "placeholder": "請輸入套餐名稱"
          },
          "group": {
            "label": "權限組",
            "placeholder": "選擇權限組",
            "add": "添加權限組",
            "none": "不綁定權限組"
          },
          "transfer": {
            "label": "流量",
            "placeholder": "請輸入流量大小",
            "unit": "GB"
          },
          "speed": {
            "label": "限速",
            "placeholder": "請輸入限速",
            "unit": "Mbps"
          },
          "price": {
            "title": "售價設置",
            "base_price": "基礎月付價格",
            "clear": {
              "button": "清空價格",
              "tooltip": "清空所有周期的價格設置"
            }
          },
          "device": {
            "label": "設備限制",
            "placeholder": "留空則不限制",
            "unit": "臺"
          },
          "capacity": {
            "label": "容量限制",
            "placeholder": "留空則不限制",
            "unit": "人"
          },
          "reset_method": {
            "label": "流量重置方式",
            "placeholder": "選擇流量重置方式",
            "description": "設置訂閱流量的重置方式，不同的重置方式會影響用戶的流量計算方式",
            "options": {
              "follow_system": "跟隨系統設置",
              "monthly_first": "每月1號",
              "monthly_reset": "按月重置",
              "no_reset": "不重置",
              "yearly_first": "每年1月1日",
              "yearly_reset": "按年重置"
            }
          },
          "content": {
            "label": "套餐描述",
            "placeholder": "在這裡編寫套餐描述...",
            "description": "支持 Markdown 格式，可以使用標題、列表、粗體、斜體等樣式來美化描述內容",
            "preview": "預覽",
            "preview_button": {
              "show": "顯示預覽",
              "hide": "隱藏預覽"
            },
            "template": {
              "button": "使用模板",
              "tooltip": "點擊使用預設的套餐描述模板",
              "content": "## 套餐特點\n• 高速穩定的全球網絡接入\n• 支持多設備同時在線\n• 無限制的流量重置\n\n## 使用說明\n1. 支持設備：iOS、Android、Windows、macOS\n2. 24/7 技術支持\n3. 自動定期流量重置\n\n## 注意事項\n- 禁止濫用\n- 遵守當地法律法規\n- 支持隨時更換套餐"
            }
          },
          "force_update": {
            "label": "強制更新到用戶",
            "description": "開啟後保存時將該套餐下用戶的權限組、流量、限速與設備數強制同步到當前值。"
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
          "description": "在這裡可以配置訂閱計劃，包括添加、刪除、編輯等操作。"
        }
      }
    },
    "email": {
      "title": "郵件設置",
      "description": "配置系統郵件服務，用於發送驗證碼、密碼重置、通知等郵件，支持多種SMTP服務商。",
      "tab_settings": "基本設置",
      "tab_templates": "模板管理",
      "email_host": {
        "title": "SMTP主機",
        "description": "SMTP服務器地址，例如：smtp.gmail.com",
        "placeholder": "smtp.example.com"
      },
      "email_port": {
        "title": "SMTP端口",
        "description": "SMTP服務器端口，常用端口：25, 465, 587",
        "placeholder": "465"
      },
      "email_username": {
        "title": "SMTP用戶名",
        "description": "SMTP認證用戶名",
        "placeholder": "user@example.com"
      },
      "email_password": {
        "title": "SMTP密碼",
        "description": "SMTP認證密碼或應用專用密碼",
        "placeholder": "請輸入密碼或應用專用密碼"
      },
      "email_encryption": {
        "title": "加密方式",
        "description": "郵件加密方式",
        "placeholder": "選擇加密方式",
        "none": "無",
        "ssl": "SSL/TLS",
        "tls": "STARTTLS"
      },
      "email_from_address": {
        "title": "發件人地址",
        "description": "發件人郵箱地址",
        "placeholder": "noreply@example.com"
      },
      "email_from_name": {
        "title": "發件人名稱",
        "description": "發件人顯示名稱"
      },
      "email_template": {
        "title": "郵件模板",
        "description": "自定義郵件模板方式請查看文檔",
        "placeholder": "選擇郵件模板"
      },
      "remind_mail_enable": {
        "title": "郵件提醒",
        "description": "開啟後用戶訂閱即將到期或流量不足時會收到郵件通知。"
      },
      "test": {
        "title": "發送測試郵件",
        "sending": "發送中...",
        "description": "發送測試郵件以驗證配置",
        "success": "測試郵件發送成功",
        "error": "測試郵件發送失敗",
        "label_to": "收件人",
        "label_subject": "主題",
        "placeholder_to": "user@example.com",
        "placeholder_subject": "測試郵件主題"
      }
    },
    "telegram": {
      "title": "Telegram設置",
      "description": "配置Telegram機器人功能，實現用戶通知、賬戶綁定、指令交互等自動化服務。",
      "bot_token": {
        "title": "機器人令牌",
        "description": "請輸入從Botfather獲取的令牌。",
        "placeholder": "0000000000:xxxxxxxxx_xxxxxxxxxxxxxxx"
      },
      "webhook_url": {
        "title": "Webhook 基礎地址",
        "description": "這裡只填寫基礎地址，系統會自動拼接 Telegram 的完整 Webhook 回調路徑。留空時默認使用站點網址。",
        "docs": "查看 Telegram Webhook 文檔",
        "placeholder": "https://example.com"
      },
      "webhook": {
        "title": "設置Webhook",
        "description": "設置機器人的webhook，不設置將無法收到Telegram通知。",
        "button": "一鍵設置",
        "setting": "設置中...",
        "success": "Webhook 設置成功",
        "error": "Webhook 設置失敗",
        "target_default": "當前將使用站點網址作為 Webhook Base URL。",
        "target_custom": "當前將使用自定義 Webhook Base URL：{{url}}",
        "debug": {
          "title": "Webhook 調試信息",
          "success": "成功狀態",
          "url": "Webhook 地址",
          "baseUrl": "基礎地址"
        }
      },
      "bot_enable": {
        "title": "啟用Telegram綁定引導",
        "description": "開啟後將在用戶端顯示Telegram綁定引導，幫助用戶綁定Telegram賬戶以接收通知。"
      },
      "discuss_link": {
        "title": "群組鏈接",
        "description": "填寫後將在用戶端顯示或在需要的地方使用。",
        "placeholder": "https://t.me/xxxxxx"
      }
    },
    "app": {
      "title": "APP設置",
      "description": "管理移動應用程序相關配置，包括API接口、版本控制、推送通知等功能設置。",
      "common": {
        "placeholder": "請輸入"
      },
      "windows": {
        "version": {
          "title": "Windows版本",
          "description": "Windows客戶端當前版本號"
        },
        "download": {
          "title": "Windows下載地址",
          "description": "Windows客戶端下載鏈接"
        }
      },
      "macos": {
        "version": {
          "title": "macOS版本",
          "description": "macOS客戶端當前版本號"
        },
        "download": {
          "title": "macOS下載地址",
          "description": "macOS客戶端下載鏈接"
        }
      },
      "android": {
        "version": {
          "title": "Android版本",
          "description": "Android客戶端當前版本號"
        },
        "download": {
          "title": "Android下載地址",
          "description": "Android客戶端下載鏈接"
        }
      }
    },
    "common": {
      "saving": "保存中...",
      "save": "保存",
      "save_success": "保存成功",
      "save_error": "保存失敗",
      "reset": "重置",
      "placeholder": "請輸入",
      "autoSaved": "已自動保存",
      "saved_at": "{{seconds}} 秒前已保存",
      "invalidJson": "JSON 格式錯誤"
    },
    "invite": {
      "title": "邀請&佣金設置",
      "description": "邀請註冊、佣金相關設置。",
      "invite_force": {
        "title": "開啟強制邀請",
        "description": "開啟後只有被邀請的用戶才可以進行註冊。"
      },
      "invite_commission": {
        "title": "邀請佣金百分比",
        "description": "默認全局的佣金分配比例，你可以在用戶管理單獨配置單個比例。",
        "placeholder": "請輸入佣金百分比"
      },
      "invite_gen_limit": {
        "title": "用戶可創建邀請碼上限",
        "description": "用戶可創建邀請碼上限",
        "placeholder": "請輸入創建上限"
      },
      "invite_never_expire": {
        "title": "邀請碼永不失效",
        "description": "開啟後邀請碼被使用後將不會失效，否則使用過後即失效。"
      },
      "commission_first_time": {
        "title": "佣金僅首次發放",
        "description": "開啟後被邀請人首次支付時才會產生佣金，可以在用戶管理對用戶進行單獨配置。"
      },
      "commission_auto_check": {
        "title": "佣金自動確認",
        "description": "開啟後佣金將會在訂單完成3日後自動進行確認。"
      },
      "commission_withdraw_limit": {
        "title": "提現單申請門檻(元)",
        "description": "小於門檻金額的提現單將不會被提交。",
        "placeholder": "請輸入提現門檻"
      },
      "commission_withdraw_method": {
        "title": "提現方式",
        "description": "可以支持的提現方式，多個用逗號分隔。",
        "placeholder": "請輸入提現方式，多個用逗號分隔"
      },
      "withdraw_close": {
        "title": "關閉提現",
        "description": "關閉後將禁止用戶申請提現，且邀請佣金將會直接進入用戶餘額。"
      },
      "commission_distribution": {
        "title": "三級分銷",
        "description": "開啟後將佣金將按照設置的3成比例進行分成，三成比例合計請不要大於100%。",
        "l1": "一級邀請人比例",
        "l2": "二級邀請人比例",
        "l3": "三級邀請人比例",
        "placeholder": "請輸入比例，如：50"
      },
      "distribution_total": "當前分銷比例合計：{{total}}%（不應超過 100%）",
      "saving": "保存中..."
    },
    "server": {
      "title": "節點配置",
      "description": "配置節點通信和同步設置，包括通信密鑰、輪詢間隔、負載均衡等高級選項。",
      "server_token": {
        "title": "通訊密鑰",
        "description": "Fboard與節點通訊的密鑰，以便數據不會被他人獲取。",
        "placeholder": "請輸入通訊密鑰",
        "generate_tooltip": "點擊生成隨機通信密鑰"
      },
      "server_pull_interval": {
        "title": "節點拉取動作輪詢間隔",
        "description": "節點從面板獲取數據的間隔頻率。",
        "placeholder": "請輸入拉取間隔"
      },
      "server_push_interval": {
        "title": "節點推送動作輪詢間隔",
        "description": "節點推送數據到面板的間隔頻率。",
        "placeholder": "請輸入推送間隔"
      },
      "device_limit_mode": {
        "title": "設備限制模式",
        "description": "寬鬆模式下，同一IP地址使用多個節點只統計為一個設備。",
        "strict": "嚴格模式",
        "relaxed": "寬鬆模式",
        "placeholder": "請選擇設備限制模式"
      },
      "server_ws_enable": {
        "title": "啟用 WebSocket 通信",
        "description": "開啟後節點將通過 WebSocket 與面板進行實時通信，延遲更低、推送更及時。",
        "supported_clients": "目前支持 WebSocket 通信的節點端：Fboard-Node"
      },
      "server_ws_url": {
        "title": "WebSocket 地址",
        "description": "節點連接面板的 WebSocket 地址，留空則自動使用站點網址。",
        "placeholder": "留空則使用站點網址"
      },
      "server_ws_log_enable": {
        "title": "WebSocket 調試日誌",
        "description": "開啟後記錄節點/機器連接、全量同步、推送等 [WS] 日誌。默認關閉，避免節點較多時刷屏；異常告警始終會寫入。修改後數秒內生效，無需重啟。"
      },
      "node_install_script_url": {
        "title": "節點安裝腳本地址",
        "description": "自定義節點安裝腳本的 URL 地址，留空則使用默認的 GitHub 地址。",
        "placeholder": "留空則使用默認地址"
      },
      "utls_fingerprints": {
        "title": "uTLS 指紋列表",
        "description": "編輯節點時「uTLS 設置 → 指紋」的具體指紋可選項。支持 chrome / firefox / safari / ios / android / edge / qq 等，也可添加客戶端支持的其它指紋名。random（訂閱時隨機）與 randomized（客戶端內隨機）由系統固定提供，無需在此配置。",
        "placeholder": "輸入指紋名稱後回車添加，如 chrome"
      },
      "saving": "保存中...",
      "manage": {
        "title": "節點管理",
        "description": "管理所有節點，包括添加、刪除、編輯等操作。"
      }
    },
    "subscribe_template": {
      "title": "訂閱模板",
      "description": "配置各個客戶端的訂閱模板（按需加載，需手動保存）",
      "unsaved_hint": "當前模板有未保存的修改，請點擊保存。",
      "singbox": {
        "title": "Sing-box 訂閱模板",
        "description": "配置 Sing-box 的訂閱模板格式"
      },
      "clash": {
        "title": "Clash 訂閱模板",
        "description": "配置 Clash 的訂閱模板格式"
      },
      "clashmeta": {
        "title": "Clash Meta 訂閱模板",
        "description": "配置 Clash Meta 的訂閱模板格式"
      },
      "stash": {
        "title": "Stash 訂閱模板",
        "description": "配置 Stash 的訂閱模板格式"
      },
      "surge": {
        "title": "Surge 配置模板",
        "description": "配置 Surge 訂閱模板，支持 Surge 配置文件格式"
      },
      "surfboard": {
        "title": "Surfboard 配置模版",
        "description": "配額 Surfboard 訂閱模版"
      }
    },
    "email_template": {
      "title": "郵件模板",
      "description": "自定義系統發送的各類郵件內容模板",
      "customized": "已自定義",
      "subject": "郵件主題",
      "subject_placeholder": "輸入郵件主題，支持 {{name}} 等佔位符",
      "content": "模板內容 (HTML)",
      "preview": "實時預覽",
      "override_hint": "修改並保存後將覆蓋系統默認模板。點擊「恢復默認」可隨時還原為當前主題的默認模板。",
      "placeholders": "可用佔位符",
      "var_name": "變量",
      "var_desc": "說明",
      "var_sample": "示例值",
      "required": "必填",
      "insert": "插入",
      "placeholder_hint": "* 標記為必須包含的佔位符，點擊可插入到內容末尾",
      "click_to_insert": "點擊插入",
      "save": "保存",
      "save_success": "模板保存成功",
      "save_before_test": "請先保存修改後再發送測試",
      "send_test": "發送測試",
      "test_dialog_title": "發送測試郵件",
      "test_dialog_description": "輸入收件郵箱，留空將發送到當前管理員郵箱",
      "test_email_placeholder": "收件郵箱（留空使用當前賬號）",
      "sending": "發送中...",
      "test_success": "測試郵件已發送",
      "reset": "恢復默認",
      "reset_title": "恢復默認模板",
      "reset_description": "確定要恢復此模板為默認內容嗎？自定義的內容將被刪除。",
      "reset_confirm": "確定恢復",
      "reset_success": "已恢復默認模板",
      "unsaved": "有未保存的修改",
      "discard_title": "未保存的修改",
      "discard_description": "當前模板有未保存的修改，切換標籤頁將丟失這些修改。",
      "discard_confirm": "丟棄修改",
      "cancel": "取消"
    }
  },
  "notice": {
    "title": "公告管理",
    "description": "在這裡可以配置公告，包括添加、刪除、編輯等操作。",
    "table": {
      "columns": {
        "id": "ID",
        "show": "顯示狀態",
        "title": "標題",
        "actions": "操作"
      },
      "toolbar": {
        "search": "搜索公告標題...",
        "reset": "重置",
        "sort": {
          "edit": "編輯排序",
          "save": "保存排序"
        }
      },
      "actions": {
        "edit": "編輯",
        "delete": {
          "title": "刪除確認",
          "description": "確定要刪除該條公告嗎？此操作無法撤銷。",
          "success": "刪除成功"
        }
      }
    },
    "form": {
      "add": {
        "title": "添加公告",
        "button": "添加公告"
      },
      "edit": {
        "title": "編輯公告"
      },
      "fields": {
        "title": {
          "label": "標題",
          "placeholder": "請輸入公告標題"
        },
        "content": {
          "label": "公告內容"
        },
        "img_url": {
          "label": "公告背景",
          "placeholder": "請輸入公告背景圖片URL"
        },
        "show": {
          "label": "顯示"
        },
        "tags": {
          "label": "節點標籤",
          "placeholder": "輸入後回車添加標籤"
        }
      },
      "buttons": {
        "cancel": "取消",
        "submit": "提交",
        "success": "提交成功"
      }
    },
    "messages": {
      "loadError": "加載公告失敗"
    }
  },
  "group": {
    "title": "權限組管理",
    "description": "管理所有權限組，包括添加、刪除、編輯等操作。",
    "columns": {
      "id": "組ID",
      "name": "組名稱",
      "usersCount": "用戶數量",
      "serverCount": "節點數量",
      "actions": "操作"
    },
    "form": {
      "add": "添加權限組",
      "edit": "編輯權限組",
      "create": "創建權限組",
      "update": "更新",
      "name": "組名稱",
      "namePlaceholder": "請輸入權限組名稱",
      "nameDescription": "權限組名稱用於標識不同的用戶組，建議使用有意義的名稱。",
      "cancel": "取消",
      "editDescription": "修改權限組信息，更新後會立即生效。",
      "createDescription": "創建新的權限組，可以為不同的用戶分配不同的權限。"
    },
    "toolbar": {
      "searchPlaceholder": "搜索權限組...",
      "reset": "重置"
    },
    "messages": {
      "deleteConfirm": "確認刪除",
      "deleteDescription": "此操作將永久刪除該權限組，刪除後無法恢復。確定要繼續嗎？",
      "deleteButton": "刪除",
      "createSuccess": "創建成功",
      "updateSuccess": "更新成功",
      "nameValidation": {
        "min": "組名至少需要2個字符",
        "max": "組名不能超過50個字符",
        "pattern": "組名只能包含字母、數字、中文、下劃線和連字符"
      }
    }
  },
  "auth": {
    "signIn": {
      "title": "登錄",
      "description": "請輸入您的郵箱和密碼登錄系統",
      "email": "郵箱地址",
      "emailPlaceholder": "name@example.com",
      "password": "密碼",
      "passwordPlaceholder": "請輸入密碼",
      "forgotPassword": "忘記密碼？",
      "submit": "登錄",
      "rememberMe": "記住我",
      "resetPassword": {
        "title": "重置密碼",
        "description": "在站點目錄下執行以下命令找回密碼",
        "command": "php artisan reset:password 管理員郵箱"
      },
      "validation": {
        "emailRequired": "請輸入郵箱地址",
        "emailInvalid": "郵箱地址格式不正確",
        "passwordRequired": "請輸入密碼",
        "passwordLength": "密碼長度至少為7個字符"
      }
    }
  },
  "traffic": {
    "trafficRecord": {
      "title": "流量使用記錄",
      "time": "時間",
      "upload": "上行流量",
      "download": "下行流量",
      "rate": "倍率",
      "total": "總計",
      "noRecords": "暫無記錄",
      "perPage": "每頁顯示",
      "records": "條記錄",
      "page": "第 {{current}} / {{total}} 頁",
      "multiplier": "{{value}}x"
    }
  },
  "payment": {
    "title": "支付配置",
    "description": "在這裡可以配置支付方式，包括支付寶、微信等。",
    "table": {
      "columns": {
        "id": "ID",
        "enable": "啟用",
        "name": "顯示名稱",
        "payment": "支付接口",
        "notify_url": "通知地址",
        "notify_url_tooltip": "支付網關將會把數據通知到本地址，請通過防火牆放行本地址。",
        "actions": "操作"
      },
      "actions": {
        "edit": "編輯",
        "copy": "複製",
        "copy_success": "複製成功",
        "delete": {
          "title": "刪除確認",
          "description": "確定要刪除該支付方式嗎？此操作無法撤銷。",
          "success": "刪除成功"
        }
      },
      "toolbar": {
        "search": "搜索支付方式...",
        "reset": "重置",
        "sort": {
          "hint": "拖拽支付方式進行排序，完成後點擊保存",
          "save": "保存排序",
          "edit": "編輯排序"
        }
      }
    },
    "form": {
      "add": {
        "button": "添加支付方式",
        "title": "添加支付方式"
      },
      "edit": {
        "title": "編輯支付方式"
      },
      "fields": {
        "name": {
          "label": "顯示名稱",
          "placeholder": "請輸入支付名稱",
          "description": "用於前端顯示"
        },
        "icon": {
          "label": "圖標URL",
          "placeholder": "https://example.com/icon.svg",
          "description": "用於前端顯示的圖標地址"
        },
        "notify_domain": {
          "label": "通知域名",
          "placeholder": "https://example.com",
          "description": "網關通知將發送到該域名"
        },
        "handling_fee_percent": {
          "label": "百分比手續費(%)",
          "placeholder": "0-100"
        },
        "handling_fee_fixed": {
          "label": "固定手續費",
          "placeholder": "0"
        },
        "payment": {
          "label": "支付接口",
          "placeholder": "請選擇支付接口",
          "description": "選擇要使用的支付接口"
        }
      },
      "validation": {
        "name": {
          "min": "名稱至少需要2個字符",
          "max": "名稱不能超過30個字符"
        },
        "notify_domain": {
          "url": "請輸入有效的URL"
        },
        "payment": {
          "required": "請選擇支付接口"
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
        "noConfig": "該支付方式暫無配置項"
      }
    }
  },
  "server": {
    "manage": {
      "title": "節點管理",
      "description": "管理所有節點，包括添加、刪除、編輯等操作。",
      "filtered_by_server": "當前正在查看服務器 {{server}} (SID:{{id}}) 下的節點",
      "filtered_by_server_description": "在這裡新增節點時，可以直接複用當前服務器作為部署目標。",
      "add_node_to_server": "新增節點到此服務器",
      "clear_server_filter": "清除服務器篩選"
    },
    "columns": {
      "sort": "排序",
      "nodeId": "節點ID",
      "show": "顯隱",
      "node": "節點",
      "address": "地址",
      "onlineUsers": {
        "title": "在線人數",
        "tooltip": "在線人數根據服務端上報頻率而定"
      },
      "rate": {
        "title": "倍率",
        "tooltip": "流量扣費倍率"
      },
      "traffic": {
        "title": "流量使用",
        "tooltip": "節點流量使用情況，顯示已用流量和限制",
        "total": "總流量",
        "used": "已用",
        "percentage": "使用率"
      },
      "groups": {
        "title": "權限組",
        "tooltip": "可訂閱到該節點的權限組",
        "empty": "--"
      },
      "loadStatus": {
        "title": "負載狀態",
        "tooltip": "服務器資源使用情況",
        "noData": "暫無數據",
        "details": "系統負載詳情",
        "cpu": "CPU 使用率",
        "memory": "內存使用",
        "swap": "交換區",
        "disk": "磁盤使用",
        "lastUpdate": "最後更新",
        "metrics": {
          "title": "運行指標",
          "uptime": "運行時長",
          "conns": "實時/總連接",
          "speed": "實時速率",
          "api": "API 狀態",
          "kernel": "內核狀態",
          "gc": "GC 暫停",
          "limit": "限速用戶",
          "ws": "WebSocket",
          "goroutines": "併發協程",
          "load": "系統負載",
          "users": "在線用戶"
        }
      },
      "version": "版本",
      "customId": "自定義ID",
      "originalId": "原始ID",
      "type": "類型",
      "actions": "操作",
      "copyAddress": "複製連接地址",
      "internalPort": "內部端口",
      "deployment": {
        "title": "部署方式",
        "tooltip": "查看節點是獨立部署，還是由某臺服務器託管，並可直接在列表中調整。",
        "standalone": "獨立部署",
        "standalone_row_hint": "未綁定服務器",
        "standalone_description": "該節點不依賴服務器託管，適用於單節點獨立部署。",
        "online": "在線",
        "offline": "離線",
        "inactive": "服務器未激活",
        "disabled": "節點停用",
        "enabled": "在服務器上啟用",
        "enabled_description": "僅已啟用的節點會由所選服務器拉起並同步。",
        "enabled_standalone_description": "獨立部署節點無需設置服務器啟用狀態。",
        "bind_success": "已託管到 {{server}}",
        "standalone_success": "已切換為獨立部署",
        "update_success": "部署狀態已更新",
        "update_error": "部署狀態更新失敗"
      },
      "status": {
        "0": "未運行",
        "1": "無人使用或異常",
        "2": "運行正常"
      },
      "childNode": "子節點",
      "actions_dropdown": {
        "edit": "編輯",
        "copy": "複製",
        "reset_traffic": {
          "title": "確認重置流量",
          "description": "此操作將清零該節點的上傳和下載流量，並解除禁用狀態。確定要繼續嗎？",
          "confirm": "重置流量"
        },
        "reset_traffic_success": "流量重置成功",
        "delete": {
          "title": "確認刪除",
          "description": "此操作將永久刪除該節點，刪除後無法恢復。確定要繼續嗎？",
          "confirm": "刪除"
        },
        "copy_success": "複製成功",
        "delete_success": "刪除成功"
      }
    },
    "toolbar": {
      "search": "搜索節點...",
      "type": "類型",
      "status": "運行狀態",
      "server": "服務器",
      "server_search": "搜索服務器...",
      "server_empty": "未找到服務器",
      "reset": "重置",
      "actions": "操作",
      "sort": {
        "tip": "拖拽節點進行排序，完成後點擊保存",
        "edit": "編輯排序",
        "save": "保存排序",
        "success": "排序保存成功"
      },
      "batch_delete": {
        "menu": "刪除節點",
        "button": "刪除 {{count}} 項",
        "title": "確認批量刪除",
        "description": "確定要刪除選中的 {{count}} 個節點嗎？此操作不可恢復。",
        "confirm": "確認刪除"
      },
      "batch_delete_success": "成功刪除 {{count}} 個節點",
      "batch_delete_error": "批量刪除失敗",
      "batch_show": {
        "menu": "顯示節點"
      },
      "batch_show_success": "成功顯示 {{count}} 個節點",
      "batch_show_error": "批量顯示失敗",
      "batch_hide": {
        "menu": "隱藏節點"
      },
      "batch_hide_success": "成功隱藏 {{count}} 個節點",
      "batch_hide_error": "批量隱藏失敗",
      "batch_enable": {
        "menu": "啟用節點"
      },
      "batch_enable_success": "成功啟用 {{count}} 個節點",
      "batch_enable_error": "批量啟用失敗",
      "batch_disable": {
        "menu": "禁用節點"
      },
      "batch_disable_success": "成功禁用 {{count}} 個節點",
      "batch_disable_error": "批量禁用失敗",
      "batch_reset_traffic": {
        "menu": "重置流量",
        "button": "重置 {{count}} 項流量",
        "title": "確認批量重置流量",
        "description": "確定要重置選中的 {{count}} 個節點的流量嗎？此操作將清零流量並解除禁用狀態。",
        "confirm": "確認重置"
      },
      "batch_reset_traffic_success": "成功重置 {{count}} 個節點的流量",
      "batch_reset_traffic_error": "批量重置流量失敗",
      "batch_replace": {
        "selected": "已選擇 {{count}} 個節點",
        "menu": "批量替換",
        "clear": "清除選擇",
        "title": "批量替換節點字段",
        "field": "字段",
        "search": "搜索值",
        "search_placeholder": "輸入要搜索的字符串",
        "replace": "替換值",
        "replace_placeholder": "輸入要替換成的字符串",
        "confirm": "替換",
        "search_required": "請輸入搜索值",
        "success": "成功替換 {{count}} 個節點",
        "fields": {
          "name": "節點名稱",
          "host": "主機地址",
          "port": "端口",
          "code": "節點標識",
          "group_ids": "權限組",
          "route_ids": "路由規則",
          "tags": "標籤",
          "protocol_settings": "協議設置",
          "custom_outbounds": "自定義出站",
          "custom_routes": "自定義路由",
          "cert_config": "證書配置",
          "rate_time_ranges": "倍率時間段"
        }
      },
      "filteringByMachine": "正在篩選該機器的節點：",
      "virtualNode": "虛擬節點"
    },
    "form": {
      "add_node": "添加節點",
      "edit_node": "編輯節點",
      "new_node": "新建節點",
      "type": {
        "placeholder": "選擇協議類型",
        "select_prompt": "請先選擇協議類型",
        "select_error": "請先選擇協議類型",
        "configHint": "選擇協議類型後可配置"
      },
      "name": {
        "label": "節點名稱",
        "placeholder": "請輸入節點名稱",
        "error": "請輸入有效的節點名稱"
      },
      "rate": {
        "label": "基礎倍率",
        "hint": "流量計費倍率，1 表示按實際流量計費",
        "error": "基礎倍率不能為空",
        "error_numeric": "基礎倍率必須是數字",
        "error_gte_zero": "基礎倍率必須大於或等於0",
        "child_node_tooltip": "子節點的基礎倍率繼承自父節點，無法單獨設置",
        "child_node_note": "子節點倍率繼承自父節點"
      },
      "traffic_limit": {
        "label": "流量限制",
        "placeholder": "0 表示不限制",
        "hint": "設置節點流量上限（單位：GB），0 表示不限制",
        "error_numeric": "流量限制必須是數字",
        "error_gte_zero": "流量限制必須大於或等於0"
      },
      "protocolSection": "協議配置",
      "traffic_limit_unit": "GB, 0=不限制",
      "banned": {
        "label": "禁用節點",
        "description": "禁用後節點將不可用"
      },
      "dynamic_rate": {
        "section_title": "動態倍率配置",
        "enable_label": "啟用動態倍率",
        "enable_description": "根據時間段設置不同的倍率乘數",
        "rules_label": "時間段規則",
        "add_rule": "添加規則",
        "rule_title": "規則 {{index}}",
        "start_time": "開始時間",
        "end_time": "結束時間",
        "multiplier": "倍率乘數",
        "no_rules": "暫無規則，點擊上方按鈕添加",
        "start_time_error": "開始時間不能為空",
        "end_time_error": "結束時間不能為空",
        "multiplier_error": "倍率乘數不能為空",
        "multiplier_error_numeric": "倍率乘數必須是數字",
        "multiplier_error_gte_zero": "倍率乘數必須大於或等於0"
      },
      "required_mark": "必填",
      "optional_mark": "選填",
      "required_fields_hint": "帶 * 的為必填項，提交前請完整填寫",
      "code": {
        "label": "自定義節點ID",
        "optional": "(選填)",
        "placeholder": "請輸入自定義節點ID",
        "hint": "選填；用於外部系統對照，不影響協議連接"
      },
      "tags": {
        "label": "節點標籤",
        "optional": "(選填)",
        "placeholder": "輸入後按逗號/回車添加",
        "hint": "選填；展示在用戶端節點名稱旁"
      },
      "groups": {
        "label": "權限組",
        "add": "添加權限組",
        "placeholder": "請選擇權限組",
        "empty": "未找到結果",
        "hint": "選填；不選則任何權限組用戶都看不到此節點（取決於業務邏輯，建議至少選一個）"
      },
      "machine": {
        "label": "綁定服務器",
        "placeholder": "選擇服務器（可選）",
        "none": "獨立部署",
        "enabled_hint": "選擇是否由此服務器管理該節點",
        "hint": "選填；綁定後由該服務器上的 Fboard-Node 託管此節點"
      },
      "host": {
        "label": "節點地址",
        "placeholder": "請輸入節點域名或者IP",
        "error": "節點地址不能為空"
      },
      "port": {
        "label": "連接端口",
        "placeholder": "443 或 10000-11000",
        "tooltip": "用戶實際連接使用的端口。支持單端口（如 443）或端口範圍（如 10000-11000）。Hysteria2 填寫範圍時節點會在該範圍內多端口監聽以支持端口跳躍（跨度上限 1024）；其他協議範圍僅用於訂閱隨機選端口。若使用中轉/隧道，可與服務端口不同。",
        "sync": "同步到服務端口",
        "error": "連接端口不能為空"
      },
      "server_port": {
        "label": "服務端口",
        "placeholder": "請輸入服務端口",
        "error": "服務端口不能為空",
        "tooltip": "服務器上的實際監聽端口。Hysteria2 連接端口為範圍時，節點按連接端口範圍多端口監聽，此字段作為兼容回退端口。",
        "sync": "同步到服務端口"
      },
      "listen_address": {
        "label": "監聽地址",
        "placeholder": "留空使用默認 (0.0.0.0)，或輸入: 127.0.0.1, ::1 等",
        "description": "指定服務器監聽的 IP 地址。留空則使用默認地址 (0.0.0.0)，表示監聽所有網絡接口。可設置為 127.0.0.1 (僅本地) 或特定 IP 地址",
        "show": "監聽地址",
        "hide": "隱藏監聽地址",
        "optional": "可選"
      },
      "parent": {
        "label": "父級節點",
        "placeholder": "選擇父節點",
        "none": "無",
        "hint": "選填；子節點會繼承父節點協議配置與在線狀態"
      },
      "virtualNode": {
        "label": "虛擬節點",
        "add": "添加虛擬節點",
        "addDialogTitle": "添加虛擬節點",
        "editDialogTitle": "編輯虛擬節點",
        "edit": "編輯",
        "delete": "刪除",
        "save": "保存虛擬節點",
        "saveSuccess": "虛擬節點已保存",
        "saveFailed": "保存虛擬節點失敗",
        "description": "虛擬節點是同一服務的額外接入點，與子父節點是獨立功能",
        "empty": "暫無虛擬節點",
        "tagsPlaceholder": "輸入後按回車添加",
        "host": "主機地址",
        "hostPlaceholder": "主機名 / 域名",
        "port": "端口",
        "groupIds": "權限組",
        "groupIdsHint": "只能選擇父節點已包含的權限組，超出父節點將無法連接",
        "groupIdsParentEmpty": "請先為父節點選擇權限組",
        "tags": "標籤",
        "show": "顯示",
        "visible": "顯示",
        "hidden": "隱藏",
        "namePlaceholder": "虛擬節點名稱",
        "deleteConfirmTitle": "確認刪除",
        "deleteConfirmDesc": "確定要刪除虛擬節點「{{name}}」嗎？此操作不可恢復。",
        "deleteSuccess": "虛擬節點已刪除",
        "deleteFailed": "刪除失敗",
        "toggleFailed": "更新顯示狀態失敗",
        "generateKeyPair": "生成密鑰對"
      },
      "route": {
        "label": "路由組",
        "placeholder": "選擇路由組",
        "empty": "未找到結果"
      },
      "submit": "提交",
      "cancel": "取消",
      "success": "提交成功"
    },
    "networkTemplate": {
      "title": "網絡模板",
      "empty": "當前協議暫無可用模板",
      "description": "選擇一個預設網絡模板，一鍵填充協議配置",
      "use": "使用"
    ,
      "presets": {
        "vless-tcp-vision": {
          "label": "TCP + XTLS Vision",
          "description": "VLESS + TCP + XTLS Vision 直連，速度極快，推薦"
        },
        "vless-ws-tls": {
          "label": "WebSocket + TLS + CDN",
          "description": "VLESS + WebSocket + TLS，可套 CDN（Cloudflare 等）"
        },
        "vless-grpc-tls": {
          "label": "gRPC + TLS",
          "description": "VLESS + gRPC + TLS，適合大規模負載"
        },
        "vless-tcp-reality": {
          "label": "TCP + REALITY",
          "description": "VLESS + REALITY 直連，無需證書，防主動探測"
        },
        "trojan-tls": {
          "label": "Trojan + TLS",
          "description": "標準 Trojan + TLS，端口 443"
        },
        "trojan-ws-tls": {
          "label": "Trojan + WebSocket + TLS",
          "description": "Trojan + WebSocket + TLS，可套 CDN"
        },
        "ss-simple": {
          "label": "標準 AEAD",
          "description": "Shadowsocks 加密隧道，簡潔高效"
        },
        "hy-standard": {
          "label": "Hysteria 標準",
          "description": "Hysteria 基於 QUIC，抗丟包，適合弱網"
        },
        "hy-brutal": {
          "label": "Hysteria2 Brute",
          "description": "Hysteria2 + Brute 模式，極高帶寬利用"
        },
        "tuic-v5": {
          "label": "TUIC v5 標準",
          "description": "TUIC v5 基於 QUIC，低延遲"
        },
        "anytls-default": {
          "label": "AnyTLS 默認",
          "description": "AnyTLS 自動化 TLS 偽裝"
        },
        "sudoku-default": {
          "label": "Sudoku 默認",
          "description": "低熵表 + ChaCha20 + legacy HTTPMask"
        },
        "shadowquic-default": {
          "label": "ShadowQUIC 默認",
          "description": "JLS 偽裝 + 0-RTT QUIC，默認上游 Cloudflare"
        }
      }},
    "dynamic_form": {
      "utls": {
        "fingerprint": {
          "random": "隨機（訂閱時抽取）",
          "randomized": "隨機化（客戶端內隨機）"
        }
      },
      "multiplex": {
        "enabled": {
          "label": "多路複用 (Multiplex)",
          "description": "通過單條 TCP 連接傳輸多個流，降低握手延遲"
        },
        "protocol": {
          "label": "複用協議"
        },
        "max_connections": {
          "label": "最大連接數"
        },
        "min_streams": {
          "label": "最小流數"
        },
        "padding": {
          "label": "啟用填充"
        },
        "brutal": {
          "enabled": {
            "label": "TCP Brutal (激進擁塞控制)"
          },
          "up_mbps": {
            "label": "上行帶寬"
          },
          "down_mbps": {
            "label": "下行帶寬"
          },
          "description": "TCP Brutal 是雙邊加速算法，建議帶寬設為機器實際帶寬的 80%-90%，開啟後 BBR 將失效。"
        }
      },
      "ech": {
        "description": "為支持的 TLS 客戶端啟用 Encrypted Client Hello。留空配置時會嘗試通過 DNS 查詢。",
        "generate": "自動生成 ECH 密鑰對",
        "generateSuccess": "ECH 密鑰對已生成",
        "generateFailed": "生成 ECH 密鑰失敗",
        "config": {
          "label": "ECH 配置 (PEM)",
          "placeholder": "粘貼 PEM 格式的 ECH 配置，每行一段內容",
          "description": "留空時，sing-box 會嘗試通過 DNS 加載 ECH 配置。"
        },
        "config_path": {
          "label": "ECH 配置文件路徑",
          "placeholder": "/etc/sing-box/ech.pem",
          "description": "指向 PEM 格式 ECH 配置文件的路徑。"
        },
        "query_server_name": {
          "label": "ECH 查詢域名",
          "placeholder": "可選，用於覆蓋 HTTPS 記錄查詢域名",
          "description": "覆蓋用於 ECH HTTPS 記錄查詢的域名，留空時默認使用 server_name。"
        },
        "key": {
          "label": "ECH Key",
          "placeholder": "當後端需要時粘貼 ECH key 內容",
          "description": "後端需要時可填寫的 ECH key 內容。"
        },
        "key_path": {
          "label": "ECH Key 路徑",
          "placeholder": "/etc/sing-box/ech.key",
          "description": "後端需要時可填寫的 ECH key 文件路徑。"
        }
      },
      "anytls": {
        "tls": {
          "server_name": {
            "label": "服務器名稱指示(SNI)",
            "placeholder": "當節點地址與證書不一致時用於證書驗證"
          },
          "allow_insecure": "允許不安全連接"
        },
        "padding_scheme": {
          "label": "填充方案",
          "placeholder": "選擇填充方案",
          "edit_btn": "編輯填充方案",
          "configured": "已配置 {{count}} 條規則",
          "not_configured": "未配置",
          "description": "用於混淆流量特徵的填充方案，每行一條規則，支持通配符 *",
          "use_default": "使用默認方案"
        }
      },
      "shadowsocks": {
        "cipher": {
          "label": "加密算法",
          "placeholder": "選擇加密算法",
          "search_placeholder": "搜索或輸入自定義加密方式...",
          "description": "選擇預設加密方式或輸入自定義加密方式",
          "preset_group": "預設加密方式",
          "custom_group": "自定義加密方式",
          "current_value": "當前值",
          "use_custom": "使用",
          "no_results": "未找到匹配的加密方式",
          "custom_hint": "你可以直接輸入自定義的加密方式，如：aes-256-cfb",
          "custom_label": "自定義"
        },
        "plugin": {
          "label": "插件",
          "placeholder": "選擇插件",
          "obfs_hint": "提示：配置格式如 obfs=http;obfs-host=www.bing.com;path=/",
          "v2ray_hint": "提示：WebSocket模式格式為 mode=websocket;host=mydomain.me;path=/;tls=true，QUIC模式格式為 mode=quic;host=mydomain.me",
          "gost_hint": "提示：配置格式如 mode=websocket;host=mydomain.me;path=/;tls=true",
          "shadow_tls_hint": "提示：配置格式如 host=cloud.tencent.com;password=auth_password;version=3",
          "restls_hint": "提示：配置格式如 host=www.microsoft.com;password=auth_password;version-hint=tls13;restls-script=300?100<1,400~100",
          "kcptun_hint": "提示：配置格式如 key=psk;crypt=aes-128-gcm;mode=fast;mtu=1350"
        },
        "plugin_opts": {
          "label": "插件選項",
          "description": "按照 key=value;key2=value2 格式輸入插件選項",
          "placeholder": "例如: mode=tls;host=bing.com"
        },
        "client_fingerprint": "客戶端指紋",
        "client_fingerprint_placeholder": "選擇客戶端指紋",
        "client_fingerprint_description": "客戶端偽裝指紋，用於降低被識別風險",
        "obfs": {
          "label": "混淆",
          "placeholder": "選擇混淆方式",
          "none": "無",
          "http": "HTTP"
        },
        "obfs_settings": {
          "path": "路徑",
          "host": "Host"
        },
        "cert_config": {
          "tab": "TLS 證書",
          "cert_mode": {
            "label": "證書模式",
            "description": "選擇證書申請方式，僅部分後端節點支持",
            "self_description": "自簽名模式：僅需填寫域名，證書由節點後端自動生成（10年有效期）",
            "http_description": "HTTP-01 模式：需要 80 端口可正常訪問以完成認證",
            "dns_description": "DNS-01 模式：通過 DNS 解析記錄認證，支持申請泛域名證書",
            "content_description": "內容推送模式：直接將證書內容下發至節點"
          },
          "domain": {
            "label": "證書域名",
            "placeholder": "example.com"
          },
          "email": {
            "label": "通知郵箱",
            "placeholder": "admin@example.com"
          },
          "http_port": {
            "label": "認證端口",
            "description": "ACME 認證端口 (默認 80)"
          },
          "dns_provider": {
            "label": "DNS 提供商",
            "doc_link": "查看 DNS 提供商配置指南"
          },
          "dns_env": {
            "label": "環境變量 (API 密鑰)",
            "description_short": "每行一個 KEY=VALUE 配置"
          },
          "cert_content": {
            "label": "證書內容 (PEM)",
            "placeholder": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
            "description": "粘貼完整證書 PEM 正文，不是文件路徑"
          },
          "key_content": {
            "label": "私鑰內容 (PEM)",
            "placeholder": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
            "description": "粘貼完整私鑰 PEM 正文，不是文件路徑"
          },
          "templates": {
            "title": "證書模板",
            "save_current": "儲存目前內容為模板",
            "save": "儲存模板",
            "saved": "證書模板已儲存",
            "save_failed": "儲存證書模板失敗",
            "deleted": "證書模板已刪除",
            "delete_failed": "刪除證書模板失敗",
            "delete": "刪除模板",
            "use": "使用",
            "applied": "已套用證書模板：{{name}}",
            "name_required": "請輸入模板名稱",
            "name_placeholder": "模板名稱，例如：正式證書",
            "description_placeholder": "模板描述（選填）",
            "search_placeholder": "搜尋模板名稱或描述…",
            "empty_content": "請先填寫證書內容與私鑰內容，再儲存為模板",
            "empty": "暫無證書模板"
          },
          "none_desc": "未啟用 TLS 證書配置"
        }
      },
      "vmess": {
        "tls": {
          "label": "TLS",
          "placeholder": "請選擇安全性",
          "disabled": "不支持",
          "enabled": "支持"
        },
        "tls_settings": {
          "server_name": {
            "label": "服務器名稱指示(SNI)",
            "placeholder": "不使用請留空"
          },
          "allow_insecure": "允許不安全?"
        },
        "network": {
          "label": "傳輸協議",
          "placeholder": "選擇傳輸協議"
        }
      },
      "trojan": {
        "server_name": {
          "label": "服務器名稱指示(SNI)",
          "placeholder": "當節點地址於證書不一致時用於證書驗證"
        },
        "allow_insecure": "允許不安全?",
        "reality_settings": {
          "server_name": {
            "label": "偽裝站點(dest)",
            "placeholder": "例如：example.com"
          },
          "server_port": {
            "label": "端口(port)",
            "placeholder": "例如：443"
          },
          "allow_insecure": "允許不安全?",
          "private_key": {
            "label": "私鑰(Private key)"
          },
          "public_key": {
            "label": "公鑰(Public key)"
          },
          "short_id": {
            "label": "Short ID",
            "placeholder": "可留空，長度為2的倍數，最長16位",
            "description": "客戶端可用的 shortId 列表，可用於區分不同的客戶端，使用0-f的十六進制字符",
            "generate": "生成 Short ID",
            "success": "Short ID 生成成功"
          },
          "key_pair": {
            "generate": "生成密鑰對",
            "success": "密鑰對生成成功",
            "error": "生成密鑰對失敗"
          }
        },
        "network": {
          "label": "傳輸協議",
          "placeholder": "選擇傳輸協議"
        }
      },
      "hysteria": {
        "version": {
          "label": "協議版本",
          "placeholder": "協議版本"
        },
        "alpn": {
          "label": "ALPN",
          "placeholder": "ALPN"
        },
        "obfs": {
          "label": "混淆",
          "type": {
            "label": "混淆實現",
            "placeholder": "選擇混淆實現",
            "salamander": "Salamander"
          },
          "password": {
            "label": "混淆密碼",
            "placeholder": "請輸入混淆密碼",
            "generate_success": "混淆密碼生成成功"
          }
        },
        "tls": {
          "server_name": {
            "label": "服務器名稱指示(SNI)",
            "placeholder": "當節點地址於證書不一致時用於證書驗證"
          },
          "allow_insecure": "允許不安全?"
        },
        "bandwidth": {
          "up": {
            "label": "上行寬帶",
            "placeholder": "請輸入上行寬帶",
            "suffix": "Mbps",
            "bbr_tip": "，留空則使用BBR"
          },
          "down": {
            "label": "下行寬帶",
            "placeholder": "請輸入下行寬帶",
            "suffix": "Mbps",
            "bbr_tip": "，留空則使用BBR"
          }
        }
      },
      "vless": {
        "tls": {
          "label": "安全性",
          "placeholder": "請選擇安全性",
          "none": "無",
          "tls": "TLS",
          "reality": "Reality"
        },
        "tls_settings": {
          "server_name": {
            "label": "服務器名稱指示(SNI)",
            "placeholder": "不使用請留空"
          },
          "allow_insecure": "允許不安全?"
        },
        "reality_settings": {
          "server_name": {
            "label": "偽裝站點(dest)",
            "placeholder": "例如：example.com"
          },
          "server_port": {
            "label": "端口(port)",
            "placeholder": "例如：443"
          },
          "allow_insecure": "允許不安全?",
          "private_key": {
            "label": "私鑰(Private key)"
          },
          "public_key": {
            "label": "公鑰(Public key)"
          },
          "short_id": {
            "label": "Short ID",
            "placeholder": "可留空，長度為2的倍數，最長16位",
            "description": "客戶端可用的 shortId 列表，可用於區分不同的客戶端，使用0-f的十六進制字符",
            "generate": "生成 Short ID",
            "success": "Short ID 生成成功"
          },
          "key_pair": {
            "generate": "生成密鑰對",
            "success": "密鑰對生成成功",
            "error": "生成密鑰對失敗"
          }
        },
        "network": {
          "label": "傳輸協議",
          "placeholder": "選擇傳輸協議"
        },
        "flow": {
          "label": "流控",
          "placeholder": "選擇流控"
        },
        "encryption": {
          "label": "VLESS Encryption",
          "description": "啟用 VLESS 加密",
          "server_label": "decryption",
          "server_placeholder": "./xray vlessenc 生成",
          "server_description": "服務端 decryption 參數，可由 ./xray vlessenc 生成",
          "client_label": "encryption",
          "client_placeholder": "./xray vlessenc 生成",
          "client_description": "客戶端 encryption 參數，需與服務端配對",
          "generate_hint": "./xray vlessenc 生成"
        }
      },
      "tuic": {
        "version": {
          "label": "協議版本",
          "placeholder": "選擇TUIC版本"
        },
        "password": {
          "label": "密碼",
          "placeholder": "請輸入密碼",
          "generate_success": "密碼生成成功"
        },
        "congestion_control": {
          "label": "擁塞控制",
          "placeholder": "選擇擁塞控制算法"
        },
        "udp_relay_mode": {
          "label": "UDP中繼模式",
          "placeholder": "選擇UDP中繼模式"
        },
        "tls": {
          "server_name": {
            "label": "服務器名稱指示(SNI)",
            "placeholder": "當節點地址與證書不一致時用於證書驗證"
          },
          "allow_insecure": "允許不安全?",
          "alpn": {
            "label": "ALPN",
            "placeholder": "選擇ALPN協議",
            "empty": "未找到可用的ALPN協議"
          }
        }
      },
      "socks": {
        "version": {
          "label": "協議版本",
          "placeholder": "選擇SOCKS版本"
        },
        "tls": {
          "label": "TLS",
          "placeholder": "請選擇安全性",
          "disabled": "不支持",
          "enabled": "支持"
        },
        "tls_settings": {
          "server_name": {
            "label": "服務器名稱指示(SNI)",
            "placeholder": "不使用請留空"
          },
          "allow_insecure": "允許不安全?"
        },
        "network": {
          "label": "傳輸協議",
          "placeholder": "選擇傳輸協議"
        }
      },
      "sudoku": {
        "name": "Sudoku",
        "keyPairTitle": "Sudoku 密鑰對",
        "keyPairDescription": "服務端使用 Master Public Key；Master Private Key 僅保存在面板用於派生用戶密鑰，不會下發到節點",
        "generate": "一鍵生成",
        "generateSuccess": "Sudoku 密鑰對已生成",
        "generateFailed": "生成 Sudoku 密鑰失敗",
        "publicPlaceholder": "點擊右上角「一鍵生成」自動填寫",
        "privatePlaceholder": "僅面板保存，勿洩露",
        "master_public_key": "Master 公鑰",
        "master_private_key": "Master 私鑰",
        "aead_method": "AEAD 算法",
        "padding_min": "最小填充率",
        "padding_max": "最大填充率",
        "table_type": "表類型",
        "enable_pure_downlink": "純 Sudoku 下行",
        "custom_table": "自定義表",
        "custom_tables": "自定義表列表",
        "handshake_timeout": "握手超時",
        "fallback": "回落地址",
        "multiplex": "多路複用",
        "httpmask": "HTTPMask"
      },
      "naive": {
        "tls_settings": {
          "server_name": {
            "label": "服務器名稱指示(SNI)",
            "placeholder": "不使用請留空"
          },
          "allow_insecure": "允許不安全?"
        },
        "tls": {
          "label": "TLS",
          "placeholder": "請選擇安全性",
          "disabled": "不支持",
          "enabled": "支持",
          "server_name": {
            "label": "服務器名稱指示(SNI)",
            "placeholder": "當節點地址與證書不一致時用於證書驗證"
          },
          "allow_insecure": "允許不安全連接"
        }
      },
      "http": {
        "tls": {
          "label": "TLS",
          "placeholder": "請選擇安全性",
          "disabled": "不支持",
          "enabled": "支持",
          "server_name": {
            "label": "服務器名稱指示(SNI)",
            "placeholder": "當節點地址與證書不一致時用於證書驗證"
          },
          "allow_insecure": "允許不安全連接"
        },
        "tls_settings": {
          "server_name": {
            "label": "服務器名稱指示(SNI)",
            "placeholder": "當節點地址與證書不一致時用於證書驗證"
          },
          "allow_insecure": "允許不安全連接"
        }
      },
      "mieru": {
        "transport": {
          "label": "傳輸協議",
          "placeholder": "選擇傳輸協議"
        },
        "traffic_pattern": {
          "label": "流量特徵偽裝 (Base64)",
          "placeholder": "留空使用默認；或點擊右側按鈕生成",
          "description": "可選。官方 mieru Traffic Pattern 的 Base64 串，用於 TCP 分片 / Nonce 前綴等抗 DPI 流量整形；可用 mita/mieru export traffic-pattern 導出。",
          "generate": "生成流量特徵偽裝",
          "success": "流量特徵偽裝已生成"
        }
      },
      "cert_config": {
        "tab": "TLS 證書",
        "none_desc": "未啟用 TLS 證書配置",
        "cert_mode": {
          "label": "證書模式",
          "description": "選擇證書申請方式，僅部分後端節點支持",
          "none_desc": "未啟用 TLS 證書配置"
        },
        "domain": {
          "label": "證書域名"
        },
        "email": {
          "label": "通知郵箱"
        },
        "http_port": {
          "label": "挑戰端口",
          "description": "ACME 挑戰端口 (默認 80)"
        },
        "dns_provider": {
          "label": "DNS 提供商",
          "doc_link": "查看 DNS 提供商配置指南"
        },
        "dns_env": {
          "label": "環境變量 (API 密鑰)",
          "description_short": "每行一個 KEY=VALUE 配置"
        },
        "cert_content": {
          "label": "證書內容 (PEM)",
          "placeholder": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
          "description": "粘貼完整證書 PEM 正文，不是文件路徑"
        },
        "key_content": {
          "label": "私鑰內容 (PEM)",
          "placeholder": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
          "description": "粘貼完整私鑰 PEM 正文，不是文件路徑"
        },
        "templates": {
          "title": "證書模板",
          "save_current": "儲存目前內容為模板",
          "save": "儲存模板",
          "saved": "證書模板已儲存",
          "save_failed": "儲存證書模板失敗",
          "deleted": "證書模板已刪除",
          "delete_failed": "刪除證書模板失敗",
          "delete": "刪除模板",
          "use": "使用",
          "applied": "已套用證書模板：{{name}}",
          "name_required": "請輸入模板名稱",
          "name_placeholder": "模板名稱，例如：正式證書",
          "description_placeholder": "模板描述（選填）",
          "search_placeholder": "搜尋模板名稱或描述…",
          "empty_content": "請先填寫證書內容與私鑰內容，再儲存為模板",
          "empty": "暫無證書模板"
        }
      },
      "routing": {
        "outbounds_tab": "自定義 Outbounds",
        "routes_tab": "自定義 Routes",
        "outbounds": "自定義 Outbounds (JSON)",
        "routes": "自定義 Routes (JSON)",
        "error": {
          "must_be_array": "必須是一個 JSON 數組 []",
          "invalid_json": "無效的 JSON 格式"
        }
      },
      "advanced": {
        "trigger_label": "高級設置",
        "dialog_title": "高級協議配置",
        "tls_tab": "TLS",
        "route_tab": "路由",
        "multiplex_tab": "多路複用"
      }
    },
    "network_settings": {
      "edit_protocol": "編輯協議",
      "edit_protocol_config": "編輯網絡設置",
      "edit_padding_scheme": "編輯填充方案",
      "use_template": "使用{{template}}模板",
      "json_label": "網絡設置 (JSON)",
      "json_config_placeholder": "請輸入 JSON 格式的網絡設置",
      "json_config_placeholder_with_template": "請輸入 JSON 配置，例如 path / host / serviceName 等",
      "templates": "模板列表",
      "templates_empty": "暫無可用模板，可將當前配置保存為模板",
      "templates_custom": "我的模板",
      "templates_builtin": "內置模板",
      "builtin": "內置",
      "save_as_template": "保存當前為模板",
      "save_template": "保存模板",
      "delete_template": "刪除模板",
      "use_template_btn": "使用",
      "template_name_placeholder": "模板名稱，例如：WS 自定義路徑",
      "template_name_required": "請輸入模板名稱",
      "template_empty": "當前配置為空，無法保存為模板",
      "template_from_current": "來自當前 {{network}} 配置",
      "template_custom_desc": "自定義網絡設置模板",
      "template_saved": "模板已保存",
      "template_save_failed": "保存模板失敗",
      "template_deleted": "模板已刪除",
      "template_delete_failed": "刪除模板失敗",
      "template_applied": "已應用模板：{{name}}",
      "validation": {
        "must_be_array": "配置必須是一個JSON數組",
        "must_be_object": "配置必須是一個JSON對象",
        "invalid_json": "無效的JSON格式"
      },
      "errors": {
        "save_failed": "保存時發生錯誤"
      }
    ,
      "builtin_templates": {
        "ws-basic": {
          "name": "WebSocket 基礎",
          "description": "path + Host"
        },
        "ws-cdn": {
          "name": "WebSocket + CDN",
          "description": "適合 Cloudflare 等 CDN"
        },
        "grpc-basic": {
          "name": "gRPC 基礎",
          "description": "serviceName"
        },
        "grpc-multi": {
          "name": "gRPC multiMode",
          "description": "開啟 multiMode"
        },
        "http-basic": {
          "name": "HTTP/2 基礎",
          "description": "path + host"
        },
        "tcp-none": {
          "name": "TCP 無偽裝",
          "description": "純 TCP"
        },
        "tcp-http": {
          "name": "TCP HTTP 偽裝",
          "description": "header type = http"
        },
        "xhttp-basic": {
          "name": "XHTTP 基礎",
          "description": "path 模式"
        },
        "quic-basic": {
          "name": "QUIC 基礎",
          "description": "security + key"
        },
        "kcp-basic": {
          "name": "KCP 基礎",
          "description": "mtu / tti 默認"
        }
      }},
    "common": {
      "cancel": "取消",
      "confirm": "確定"
    },
    "description": "配置節點通信與同步設置，包括通信密鑰、輪詢間隔、負載均衡等高級選項。",
    "device_limit_mode": {
      "description": "寬鬆模式下，同一 IP 地址的多個節點計為 1 臺設備。",
      "placeholder": "請選擇設備限制模式",
      "relaxed": "寬鬆模式",
      "strict": "嚴格模式",
      "title": "設備限制模式"
    },
    "saving": "保存中...",
    "server_pull_interval": {
      "description": "節點從面板拉取數據的頻率。",
      "placeholder": "請輸入拉取間隔",
      "title": "節點拉取輪詢間隔"
    },
    "server_push_interval": {
      "description": "節點向面板推送數據的頻率。",
      "placeholder": "請輸入推送間隔",
      "title": "節點推送輪詢間隔"
    },
    "server_token": {
      "description": "面板與節點通信的密鑰，用於防止未授權訪問。",
      "placeholder": "請輸入通信密鑰",
      "title": "通信密鑰"
    },
    "title": "節點配置",
    "messages": {
      "saveFailed": "保存失敗"
    }
  },
  "coupon": {
    "title": "優惠券管理",
    "description": "在這裡可以查看優惠券，包括增加、查看、刪除等操作。",
    "table": {
      "columns": {
        "id": "ID",
        "show": "啟用",
        "name": "卷名稱",
        "type": "類型",
        "code": "卷碼",
        "limitUse": "剩餘次數",
        "limitUseWithUser": "可用次數/用戶",
        "validity": "有效期",
        "actions": "操作"
      },
      "validity": {
        "expired": "已過期{{days}}天",
        "notStarted": "{{days}}天后開始",
        "remaining": "剩餘{{days}}天",
        "startTime": "開始時間",
        "endTime": "結束時間",
        "unlimited": "無限次",
        "noLimit": "無限制"
      },
      "actions": {
        "edit": "編輯",
        "delete": "刪除",
        "deleteConfirm": {
          "title": "確認刪除",
          "description": "此操作將永久刪除該優惠券，刪除後無法恢復。確定要繼續嗎？",
          "confirmText": "刪除"
        }
      },
      "toolbar": {
        "search": "搜索優惠券...",
        "type": "類型",
        "reset": "重置",
        "types": {
          "1": "按金額優惠",
          "2": "按比例優惠"
        }
      }
    },
    "form": {
      "add": "添加優惠券",
      "edit": "編輯優惠券",
      "name": {
        "label": "優惠券名稱",
        "placeholder": "請輸入優惠券名稱",
        "required": "請輸入優惠券名稱"
      },
      "type": {
        "label": "優惠券類型和值",
        "placeholder": "優惠券類型"
      },
      "value": {
        "placeholder": "請輸入金額（元）"
      },
      "validity": {
        "label": "優惠券有效期",
        "to": "至",
        "endTimeError": "結束時間必須晚於開始時間"
      },
      "limitUse": {
        "label": "最大使用次數",
        "placeholder": "限制最大使用次數，留空則不限制",
        "description": "設置優惠券的總使用次數限制，留空表示不限制使用次數"
      },
      "limitUseWithUser": {
        "label": "每個用戶可使用次數",
        "placeholder": "限制每個用戶可使用次數，留空則不限制",
        "description": "限制每個用戶可使用該優惠券的次數，留空表示不限制單用戶使用次數"
      },
      "limitPeriod": {
        "label": "指定週期",
        "placeholder": "限制指定週期可以使用優惠，留空則不限制",
        "description": "選擇可以使用優惠券的訂閱週期，留空表示不限制使用週期",
        "empty": "沒有找到匹配的週期"
      },
      "limitPlan": {
        "label": "指定訂閱",
        "placeholder": "限制指定訂閱可以使用優惠，留空則不限制",
        "description": "選擇可以使用優惠券的訂閱計劃，留空表示不限制計劃",
        "empty": "沒有找到匹配的訂閱"
      },
      "code": {
        "label": "自定義優惠碼",
        "placeholder": "自定義優惠碼，留空則自動生成",
        "description": "可以自定義優惠碼，留空則系統自動生成"
      },
      "generateCount": {
        "label": "批量生成數量",
        "placeholder": "批量生成優惠碼數量，留空則生成單個",
        "description": "批量生成多個優惠碼，留空則只生成單個優惠碼"
      },
      "submit": {
        "saving": "保存中...",
        "save": "保存"
      },
      "error": {
        "saveFailed": "保存優惠券失敗"
      },
      "timeRange": {
        "quickSet": "快速設置",
        "presets": {
          "1week": "1周",
          "2weeks": "2周",
          "1month": "1個月",
          "3months": "3個月",
          "6months": "6個月",
          "1year": "1年"
        }
      }
    },
    "period": {
      "hourly": "小時",
      "daily": "天",
      "monthly": "月",
      "quarterly": "季度",
      "half_yearly": "半年",
      "yearly": "年",
      "two_yearly": "兩年",
      "three_yearly": "三年",
      "onetime": "一次性",
      "reset_traffic": "重置流量"
    }
  },
  "route": {
    "title": "路由管理",
    "description": "管理所有路由組，包括添加、刪除、編輯等操作。",
    "columns": {
      "id": "組ID",
      "remarks": "備註",
      "action": "動作",
      "actions": "操作",
      "matchRules": "匹配{{count}}條規則",
      "action_value": {
        "title": "動作值",
        "dns": "DNS: {{value}}",
        "proxy": "轉發 ({{value}})",
        "block": "阻止訪問",
        "direct": "直連"
      }
    },
    "actions": {
      "dns": "指定DNS服務器進行解析",
      "block": "禁止訪問",
      "direct": "直連",
      "proxy": "轉發",
      "short": {
        "dns": "DNS",
        "block": "阻止",
        "direct": "直連",
        "proxy": "轉發"
      }
    },
    "form": {
      "add": "添加路由",
      "edit": "編輯路由",
      "create": "創建路由",
      "remarks": "備註",
      "remarksPlaceholder": "請輸入備註",
      "match": "匹配規則",
      "matchPlaceholder": "example.com\n*.example.com",
      "action": "動作",
      "actionPlaceholder": "請選擇動作",
      "dns": "DNS服務器",
      "dnsPlaceholder": "請輸入DNS服務器",
      "proxy": "轉發標籤 (Outbound Tag)",
      "proxyPlaceholder": "請輸入轉發標籤",
      "cancel": "取消",
      "submit": "提交",
      "validation": {
        "remarks": "請輸入有效的備註"
      }
    },
    "toolbar": {
      "searchPlaceholder": "搜索路由...",
      "reset": "重置"
    },
    "messages": {
      "deleteConfirm": "確認刪除",
      "deleteDescription": "此操作將永久刪除該路由組，刪除後無法恢復。確定要繼續嗎？",
      "deleteButton": "刪除",
      "deleteSuccess": "刪除成功",
      "createSuccess": "創建成功",
      "updateSuccess": "更新成功"
    }
  },
  "ticket": {
    "title": "工單管理",
    "description": "在這裡可以查看用戶工單，包括查看、回覆、關閉等操作。",
    "columns": {
      "id": "工單號",
      "subject": "主題",
      "level": "優先級",
      "status": "狀態",
      "updated_at": "最後更新",
      "created_at": "創建時間",
      "actions": "操作"
    },
    "status": {
      "closed": "已關閉",
      "replied": "已回覆",
      "pending": "待回覆",
      "processing": "處理中",
      "unreplied": "未回覆"
    },
    "level": {
      "low": "低優先",
      "medium": "中優先",
      "high": "高優先"
    },
    "filter": {
      "placeholder": "搜索{field}...",
      "no_results": "未找到結果",
      "selected": "已選擇 {count} 項",
      "clear": "清除篩選"
    },
    "actions": {
      "reply_success": "已回覆",
      "view_details": "查看詳情",
      "close_ticket": "關閉工單",
      "close_confirm_title": "確認關閉工單",
      "close_confirm_description": "確定要關閉這個工單嗎？關閉後會移入已關閉列表，但仍可繼續回覆。",
      "close_confirm_button": "確認關閉",
      "close_success": "工單已關閉",
      "view_ticket": "查看工單"
    },
    "detail": {
      "no_messages": "暫無消息記錄",
      "created_at": "創建於",
      "sender_admin": "管理員",
      "sender_user": "用戶",
      "user_info": "用戶信息",
      "traffic_records": "流量記錄",
      "order_records": "訂單記錄",
      "input": {
        "closed_reply_placeholder": "工單已關閉，仍可繼續回覆...",
        "closed_hint": "該工單已關閉，你仍可以繼續回覆，新的消息會追加到當前工單。",
        "reply_placeholder": "輸入回覆內容...",
        "sending": "發送中...",
        "send": "發送",
        "shortcut_hint": "Enter 發送 · Shift + Enter 換行"
      }
    },
    "list": {
      "title": "工單列表",
      "search_placeholder": "搜索工單標題或用戶郵箱",
      "no_tickets": "暫無工單",
      "no_open_tickets": "暫無處理中工單",
      "no_closed_tickets": "暫無已關閉工單",
      "no_search_results": "未找到匹配的工單",
      "collapse": "收起列表",
      "expand": "展開列表"
    }
  },
    "withdrawal": {
    "title": "提現管理",
    "description": "管理用戶佣金提現申請，支持確認提現和拒絕提現操作。",
    "columns": {
      "id": "提現單號",
      "user": "用戶",
      "method": "提現方式",
      "account": "提現帳號",
      "amount": "金額",
      "status": "狀態",
      "created_at": "建立時間",
      "actions": "操作"
    },
    "status": {
      "pending": "待處理",
      "confirmed": "已確認",
      "closed": "已拒絕"
    },
    "filter": {
      "all": "全部"
    },
    "actions": {
      "view": "查看詳情",
      "confirm": "確認提現",
      "close": "關閉提現",
      "user_info": "用戶資訊",
      "confirm_title": "確認提現",
      "confirm_description": "確認後將關閉該提現單，請確保款項已處理。",
      "confirm_button": "確認提現",
      "confirm_success": "提現已確認",
      "close_confirm_title": "關閉提現",
      "close_confirm_description": "關閉後將把佣金返還給用戶帳戶。",
      "close_confirm_button": "確認關閉",
      "close_success": "提現已關閉，佣金已返還",
      "reply_success": "回覆成功",
      "confirm_desc": "確認後將關閉該提現單，請確保款項已處理。",
      "close_desc": "關閉後將把佣金返還給用戶帳戶，是否繼續？"
    },
    "list": {
      "search_placeholder": "搜索提現帳號...",
      "no_withdrawals": "暫無提現記錄",
      "no_open_withdrawals": "暫無待處理提現",
      "title": "提現列表",
      "collapse": "收起列表",
      "expand": "展開列表"
    },
    "detail": {
      "created_at": "建立時間",
      "user_info": "用戶資訊",
      "traffic_records": "流量記錄",
      "order_records": "訂單記錄",
      "no_messages": "暫無聊天記錄",
      "operator": "操作員",
      "remark": "備註",
      "remark_placeholder": "輸入備註（可選）",
      "sender_user": "用戶",
      "sender_admin": "管理員",
      "input": {
        "closed_hint": "該提現單已處理，無法繼續回覆",
        "reply_placeholder": "輸入消息...",
        "closed_reply_placeholder": "該提現單已處理",
        "send": "發送",
        "sending": "發送中...",
        "shortcut_hint": "回車發送，Shift+回車換行"
      }
    }
  },

  "machine": {
    "title": "服務器管理",
    "description": "用於查看服務器健康、負載與承載節點，並從運維視角管理 Fboard-Node 服務。",
    "columns": {
      "id": "ID",
      "name": "服務器名稱",
      "status": "狀態",
      "nodes": "節點數",
      "nodesHosted": "節點數",
      "nodesIdle": "暫無承載",
      "load": "負載",
      "lastSeen": "最後心跳",
      "version": "版本",
      "actions": "操作",
      "online": "在線",
      "offline": "離線",
      "inactive": "已禁用",
      "noData": "暫無負載數據",
      "cpu": "CPU",
      "memory": "內存",
      "disk": "磁盤",
      "never": "從未上報",
      "lastReport": "負載上報",
      "kernel": "內核",
      "kernelRunning": "運行中",
      "kernelStopped": "已停止",
      "kernelPartial": "部分運行",
      "kernelIdle": "無節點",
      "kernelUnknown": "未知",
      "kernelDetail": "{{running}}/{{total}} 運行"
    },
    "toolbar": {
      "search": "搜索服務器名稱或備註...",
      "status": "狀態",
      "status_all": "全部狀態",
      "status_online": "在線",
      "status_offline": "離線",
      "status_inactive": "已禁用",
      "status_high_load": "高負載",
      "nodes": "節點",
      "with_nodes": "已承載節點",
      "idle_nodes": "空閒服務器",
      "high_load": "高負載",
      "online_ratio": "在線",
      "high_load_count": "高負載",
      "tip": "適合集中查看服務器在線情況、承載節點數量與資源壓力。",
      "reset": "重置",
      "nodesHosted": "節點",
      "nodesIdle": "空閒"
    },
    "operations": {
      "upgrade": "升級 Fboard-Node",
      "ops": "內核運維",
      "start": "啟動內核",
      "stop": "停止內核",
      "reload": "重載內核",
      "restart": "重啟內核",
      "upgradeTitle": "確認升級服務器",
      "upgradeDescription": "將升級服務器“{{name}}”上的 Fboard-Node 服務。升級過程中該服務器上的服務可能短暫中斷。",
      "startTitle": "確認啟動內核",
      "startDescription": "將啟動服務器“{{name}}”上所有節點的內嵌 xray 內核。fboard-node 進程與 WebSocket 保持運行。",
      "stopTitle": "確認停止內核",
      "stopDescription": "將停止服務器“{{name}}”上所有節點的內嵌 xray 內核，該服務器上的代理將不可用，直到再次啟動。進程與 WebSocket 保持運行。",
      "reloadTitle": "確認重載內核",
      "reloadDescription": "將重載服務器“{{name}}”上所有節點的內嵌 xray 內核配置；進程與 WebSocket 保持運行。",
      "restartTitle": "確認重啟內核",
      "restartDescription": "將強制重建服務器“{{name}}”上所有節點的內嵌 xray 內核，代理會短暫中斷。fboard-node 進程與 WebSocket 保持運行。",
      "upgradeSubmitted": "服務器“{{name}}”的升級任務已提交",
      "startSubmitted": "服務器“{{name}}”的內核啟動任務已提交",
      "stopSubmitted": "服務器“{{name}}”的內核停止任務已提交",
      "reloadSubmitted": "服務器“{{name}}”的內核重載任務已提交",
      "restartSubmitted": "服務器“{{name}}”的內核重啟任務已提交",
      "batchUpgrade": "一鍵升級服務器",
      "batchUpgradeTitle": "確認批量升級服務器",
      "batchUpgradeDescription": "將對所有在線且啟用的服務器各提交一次 Fboard-Node 升級任務，不依賴服務器承載的節點數量。",
      "batchUpgradeSubmitted": "已提交 {{submitted}} 臺服務器；跳過 {{inactive}} 臺禁用、{{offline}} 臺離線服務器"
    },

    "overview": {
      "total": "服務器總數",
      "total_hint": "共承載 {{count}} 個節點",
      "online": "在線服務器",
      "online_hint": "最近 5 分鐘內正常心跳",
      "offline": "離線/失聯",
      "offline_hint": "需要檢查心跳或節點代理",
      "high_load": "高負載",
      "high_load_hint": "CPU、內存或磁盤接近閾值",
      "nodes_suffix": "節點",
      "attention": "需關注",
      "stable": "穩定",
      "needs_review": "建議檢查",
      "normal": "正常"
    },
    "form": {
      "add": "添加服務器",
      "create": "新建服務器",
      "edit": "編輯服務器",
      "createDescription": "當你希望一臺服務器承載多個節點時，再創建服務器記錄。",
      "editDescription": "修改服務器名稱、備註或啟用狀態。",
      "name": "服務器名稱",
      "namePlaceholder": "例如 HK-01",
      "nameError": "請輸入服務器名稱",
      "notes": "備註",
      "notesPlaceholder": "關於此服務器的可選備註",
      "isActive": "啟用服務器",
      "isActiveDescription": "禁用後 Fboard-Node 將不再使用此服務器。",
      "cancel": "取消",
      "submit": "提交",
      "update": "更新"
    },
    "token": {
      "title": "服務器 Token",
      "description": "此 Token 用於 Fboard-Node 向面板認證，請妥善保管。",
      "show": "查看 Token",
      "hide": "隱藏 Token",
      "reset": "重置 Token",
      "resetConfirm": "確認重置 Token？",
      "resetDescription": "舊 Token 將立即失效，Fboard-Node 需要重新配置新 Token。",
      "copy": "複製",
      "copied": "Token 已複製到剪貼板",
      "copiedInline": "已複製!",
      "copyFailed": "複製失敗，請手動複製",
      "autoHide": "{{time}} 後自動隱藏",
      "resetSuccess": "Token 已重置",
      "createdHint": "Token 已生成，後續可在服務器詳情頁中查看。"
    },
    "install": {
      "title": "安裝 Fboard-Node",
      "description": "在目標服務器上執行此命令，即可用 machine mode 安裝 Fboard-Node 並接入當前服務器記錄。",
      "copy": "複製安裝命令",
      "copied": "安裝命令已複製",
      "copiedInline": "已複製!",
      "copyFailed": "複製失敗",
      "loading": "正在生成命令...",
      "hint": "需要 root 或 sudo 權限，且目標服務器需為支持 systemd 的 Linux。"
    },
    "logs": {
      "title": "運行日誌",
      "description": "來自 Fboard-Node 進程內存中的最近日誌（最多約 1000 行）。",
      "refresh": "刷新日誌",
      "copy": "複製日誌",
      "copied": "日誌已複製",
      "loading": "正在拉取日誌...",
      "empty": "暫無日誌",
      "offline": "服務器離線，無法拉取實時日誌",
      "stale": "顯示緩存日誌（可能不是最新）",
      "timeout": "等待節點響應超時",
      "updatedAt": "更新於 {{time}}",
      "lineCount": "{{count}} 行",
      "autoScroll": "自動滾動到底部",
      "fetchFailed": "拉取日誌失敗"
    },
    "detail": {
      "title": "服務器詳情",
      "info": "服務器信息",
      "associatedNodes": "關聯節點",
      "noNodes": "暫無綁定節點。",
      "nodeId": "ID",
      "nodeName": "名稱",
      "nodeType": "類型",
      "nodeHost": "地址",
      "nodePort": "端口",
      "nodeShow": "可見",
      "nodeEnabled": "已激活",
      "loadTrend": "負載趨勢",
      "networkTrend": "網絡速率",
      "noHistory": "暫無歷史負載數據",
      "openNodeManage": "前往節點管理",
      "addNodeToServer": "新增節點到此服務器",
      "nodeCount": "{{count}} 個節點",
      "nodeEnabledCount": "{{count}} 個已激活",
      "toggleEnabledError": "切換節點狀態失敗",
      "bindExistingButton": "關聯已有節點",
      "bindExistingTitle": "關聯已有節點",
      "bindExistingDescription": "選擇要關聯到「{{name}}」的節點",
      "bindSearchPlaceholder": "搜索節點名稱、地址、類型...",
      "bindTypeAll": "全部類型",
      "noUnboundNodes": "沒有未綁定的節點",
      "noSearchResults": "沒有匹配的節點",
      "selectAll": "全選（共 {{count}} 個）",
      "selectedCount": "已選 {{count}} 個",
      "bindConfirm": "關聯 {{count}} 個節點",
      "binding": "關聯中...",
      "bindSuccess": "成功將 {{count}} 個節點關聯到「{{name}}」",
      "bindFailed": "關聯失敗",
      "unbindNode": "取消關聯",
      "unbindSuccess": "已取消「{{name}}」的關聯",
      "unbindFailed": "取消關聯失敗",
      "unbindConfirmTitle": "確認取消關聯",
      "unbindConfirmDescription": "將把節點「{{name}}」從當前服務器上解綁（節點本身不會被刪除）。",
      "cancel": "取消"
    },
    "messages": {
      "createSuccess": "服務器創建成功",
      "updateSuccess": "服務器更新成功",
      "deleteConfirm": "確認刪除服務器？",
      "deleteDescription": "關聯節點將自動解綁（不會被刪除），此操作不可撤銷。",
      "deleteButton": "刪除",
      "deleteSuccess": "服務器刪除成功",
      "deleteFailed": "刪除服務器失敗",
      "saveFailed": "保存服務器失敗",
      "tokenFetchFailed": "獲取令牌失敗",
      "tokenResetFailed": "重置令牌失敗"
    },
    "nodeForm": {
      "machineId": "綁定服務器",
      "machineIdPlaceholder": "選擇一臺服務器（可選）",
      "machineIdNone": "獨立部署",
      "enabled": "在服務器上激活",
      "enabledDescription": "節點是否在所選服務器上啟用運行"
    },
    "nodesStatus": {
      "toggleHint": "在節點管理中修改狀態"
    }
  },
  "search": {
    "placeholder": "搜索菜單和功能...",
    "title": "菜單導航",
    "noResults": "未找到結果",
    "shortcut": {
      "label": "搜索",
      "key": "⌘K"
    }
  },
  "knowledge": {
    "title": "知識庫管理",
    "description": "在這裡可以配置知識庫，包括添加、刪除、編輯等操作。",
    "columns": {
      "id": "ID",
      "status": "狀態",
      "title": "標題",
      "category": "分類",
      "actions": "操作"
    },
    "form": {
      "add": "添加知識",
      "edit": "編輯知識",
      "title": "標題",
      "titlePlaceholder": "請輸入知識標題",
      "category": "分類",
      "categoryPlaceholder": "請輸入分類，分類將會自動歸類",
      "language": "語言",
      "languagePlaceholder": "請選擇語言",
      "content": "內容",
      "show": "顯示",
      "cancel": "取消",
      "submit": "提交"
    },
    "languages": {
      "en-US": "English",
      "ja-JP": "日本語",
      "ko-KR": "한국어",
      "vi-VN": "Tiếng Việt",
      "zh-CN": "簡體中文",
      "zh-TW": "繁體中文",
      "ru-RU": "Русский"
    },
    "messages": {
      "deleteConfirm": "確認刪除",
      "deleteDescription": "此操作將永久刪除該知識庫記錄，刪除後無法恢復。確定要繼續嗎？",
      "deleteButton": "刪除",
      "operationSuccess": "操作成功",
      "loadError": "加載失敗"
    },
    "toolbar": {
      "searchPlaceholder": "搜索知識...",
      "reset": "重置",
      "sortModeHint": "拖拽知識條目進行排序，完成後點擊保存",
      "editSort": "編輯排序",
      "saveSort": "保存排序",
      "allCategories": "全部分類"
    }
  },
  "common": {
    "all": "全部",
    "clear": "清除",
    "selectAll": "全選",
    "loading": "加載中...",
    "error": "錯誤",
    "success": "成功",
    "save": "保存",
    "cancel": "取消",
    "confirm": "確認",
    "close": "關閉",
    "delete": {
      "success": "刪除成功",
      "failed": "刪除失敗"
    },
    "edit": "編輯",
    "view": "查看",
    "toggleNavigation": "切換導航",
    "toggleSidebar": "切換側邊欄",
    "search": "搜索...",
    "noMatch": "無匹配選項",
    "selectField": "選擇{{name}}",
    "inputField": "輸入{{name}}",
    "pageNotImplemented": "該頁面待實現",
    "theme": {
      "label": "主題",
      "light": "淺色",
      "dark": "深色",
      "system": "跟隨系統"
    },
    "user": "用戶",
    "defaultEmail": "user@example.com",
    "settings": "設置",
    "logout": "退出登錄",
    "copy": {
      "success": "複製成功",
      "failed": "複製失敗",
      "error": "複製失敗",
      "errorLog": "複製到剪貼板時出錯"
    },
    "submit": "提交",
    "saving": "保存中...",
    "table": {
      "noData": "暫無數據",
      "pagination": {
        "selected": "已選擇 {{selected}} 項，共 {{total}} 項",
        "itemsPerPage": "每頁",
        "page": "第",
        "pageOf": "第 {{page}}/{{total}} 頁",
        "range": "第 {{from}}–{{to}} 條，共 {{total}} 條",
        "firstPage": "跳轉到第一頁",
        "previousPage": "上一頁",
        "nextPage": "下一頁",
        "lastPage": "跳轉到最後一頁"
      },
      "viewOptions": {
        "button": "顯示列",
        "label": "切換顯示列"
      }
    },
    "update": {
      "title": "系統更新",
      "newVersion": "發現新版本",
      "currentVersion": "當前版本",
      "latestVersion": "最新版本",
      "updateLater": "稍後更新",
      "updateNow": "立即更新",
      "updating": "更新中...",
      "updateSuccess": "更新成功，系統將在稍後自動重啟",
      "updateFailed": "更新失敗，請稍後重試"
    },
    "time": {
      "day": "天",
      "hour": "小時"
    },
    "reset": "重置",
    "export": "導出",
    "currency": {
      "yuan": "元"
    },
    "http": {
      "notLoggedIn": "未登錄",
      "unknownError": "未知錯誤",
      "loginExpired": "登錄已過期",
      "loginExpiredRelogin": "登錄已過期，請重新登錄",
      "unauthorized": "未授權，請重新登錄",
      "invalidCredentials": "郵箱或密碼錯誤",
      "invalidData": "提交的數據有誤，請檢查輸入",
      "requestFailed": "請求失敗",
      "networkError": "網絡錯誤",
      "noPermission": "沒有權限",
      "notFound": "資源或接口不存在",
      "unknownException": "未知異常",
      "success": "操作成功"
    },
    "add": "添加",
    "refresh": "刷新",
    "sort": {
      "edit": "編輯排序",
      "done": "完成排序"
    },
    "actions": "操作",
    "start": "起",
    "end": "止"
  },
  "plugin": {
    "title": "插件管理",
    "description": "管理和配置系統插件",
    "search": {
      "placeholder": "搜索插件名稱或描述..."
    },
    "type": {
      "placeholder": "選擇插件類型",
      "all": "全部類型"
    },
    "tabs": {
      "all": "所有插件",
      "installed": "已安裝",
      "available": "可用"
    },
    "status": {
      "enabled": "已啟用",
      "disabled": "已禁用",
      "not_installed": "未安裝",
      "protected": "受保護",
      "filter_placeholder": "安裝狀態",
      "all": "全部狀態",
      "installed": "已安裝",
      "available": "可安裝"
    },
    "button": {
      "install": "安裝",
      "upgrade": "升級",
      "config": "配置",
      "enable": "啟用",
      "disable": "禁用",
      "uninstall": "卸載",
      "readme": "查看文檔",
      "menuDemo": "菜單演示"
    },
    "upload": {
      "button": "上傳插件",
      "title": "上傳插件",
      "description": "上傳插件包 (.zip)",
      "dragText": "拖拽插件包到此處，或",
      "clickText": "瀏覽",
      "supportText": "僅支持 .zip 格式文件",
      "uploading": "上傳中...",
      "error": {
        "format": "僅支持 .zip 格式文件"
      }
    },
    "delete": {
      "title": "刪除插件",
      "description": "確定要刪除此插件嗎？此操作無法撤銷。",
      "button": "刪除"
    },
    "uninstall": {
      "title": "卸載插件",
      "description": "確定要卸載此插件嗎？卸載後插件數據將被清除。",
      "button": "卸載"
    },
    "upgrade": {
      "title": "升級插件",
      "description": "確定要升級此插件嗎？升級過程中插件將暫時不可用。",
      "button": "升級"
    },
    "config": {
      "title": "配置",
      "description": "修改插件配置",
      "save": "保存",
      "cancel": "取消",
      "noConfigs": "該插件沒有可配置的選項",
      "actions": "操作",
      "selectPlan": "請選擇套餐",
      "noPlan": "不選擇套餐"
    },
    "readme": {
      "title": "插件文檔",
      "empty": "暫無文檔"
    },
    "author": "作者",
    "messages": {
      "installSuccess": "插件安裝成功",
      "installError": "插件安裝失敗",
      "upgradeSuccess": "插件升級成功",
      "upgradeError": "插件升級失敗",
      "uninstallSuccess": "插件卸載成功",
      "uninstallError": "插件卸載失敗",
      "enableSuccess": "插件啟用成功",
      "enableError": "插件啟用失敗",
      "disableSuccess": "插件禁用成功",
      "disableError": "插件禁用失敗",
      "configLoadError": "加載插件配置失敗",
      "configSaveSuccess": "配置保存成功",
      "configSaveError": "配置保存失敗",
      "uploadSuccess": "插件上傳成功",
      "uploadError": "插件上傳失敗",
      "deleteSuccess": "插件刪除成功",
      "deleteError": "插件刪除失敗",
      "actionSuccess": "執行成功",
      "actionError": "執行失敗",
      "actionLabel": "動作",
      "actionSuccessWithLabel": "{{label}} 執行成功",
      "actionErrorWithLabel": "{{label}} 執行失敗",
      "invalidJson": "{{field}} 不是有效的 JSON"
    },
    "staticFiles": {
      "title": "HTML 靜態文件",
      "previewTitle": "插件 HTML 預覽",
      "backToList": "返回列表",
      "openInNewTab": "新標籤頁打開",
      "empty": "暫無靜態文件"
    },
    "noPlugins": "暫無插件",
    "toolbar": {
      "search": "搜索插件..."
    }
  },
  "dashboard": {
    "title": "儀表盤",
    "stats": {
      "newUsers": "新用戶",
      "totalScore": "總積分",
      "monthlyUpload": "月上傳",
      "vsLastMonth": "對比上月",
      "vsYesterday": "對比昨日",
      "todayIncome": "今日收入",
      "monthlyIncome": "月收入",
      "totalIncome": "總收入",
      "totalUsers": "總用戶",
      "activeUsers": "活躍用戶: {{count}}",
      "totalOrders": "總訂單",
      "revenue": "收入",
      "todayRegistered": "今日註冊",
      "monthlyRegistered": "月註冊",
      "onlineUsers": "在線用戶",
      "pendingTickets": "待處理工單",
      "hasPendingTickets": "有工單需要處理",
      "noPendingTickets": "無待處理工單",
      "pendingCommission": "待處理佣金",
      "hasPendingCommission": "有佣金需要確認",
      "noPendingCommission": "無待處理佣金",
      "monthlyNewUsers": "月新增用戶",
      "monthlyDownload": "月下載",
      "todayTraffic": "今日: {{value}}",
      "activeUserTrend": "活躍用戶趨勢",
      "realtimeUsers": "實時用戶",
      "todayPeak": "今日峰值",
      "vsLastWeek": "對比上週"
    },
    "trafficRank": {
      "nodeTrafficRank": "節點流量排行",
      "userTrafficRank": "用戶流量排行",
      "today": "今天",
      "last7days": "最近7天",
      "last30days": "最近30天",
      "customRange": "自定義範圍",
      "selectTimeRange": "選擇時間範圍",
      "selectDateRange": "選擇日期範圍",
      "currentTraffic": "當前流量",
      "previousTraffic": "上期流量",
      "changeRate": "變化率",
      "recordTime": "記錄時間"
    },
    "overview": {
      "title": "收入概覽",
      "thisMonth": "本月",
      "lastMonth": "上月",
      "to": "至",
      "selectTimeRange": "選擇範圍",
      "selectDate": "選擇日期",
      "last7Days": "最近7天",
      "last30Days": "最近30天",
      "last90Days": "最近90天",
      "last180Days": "最近180天",
      "lastYear": "最近一年",
      "customRange": "自定義範圍",
      "amount": "金額",
      "count": "數量",
      "transactions": "{{count}} 筆交易",
      "orderAmount": "訂單金額",
      "commissionAmount": "佣金金額",
      "orderCount": "訂單數量",
      "commissionCount": "佣金數量",
      "totalIncome": "總收入",
      "totalCommission": "總佣金",
      "totalTransactions": "共 {{count}} 筆交易",
      "avgOrderAmount": "平均訂單金額:",
      "commissionRate": "佣金比例:"
    },
    "queue": {
      "title": "隊列狀態",
      "metrics": {
        "pending": "待處理 {{count}}",
        "maxWait": "最長等待 {{time}}",
        "backlog": "積壓",
        "processes": "進程",
        "pendingLabel": "待處理",
        "wait": "等待"
      },
      "jobDetails": "作業詳情",
      "workload": "隊列負載",
      "workloadCount": "共 {{count}} 個隊列",
      "status": {
        "description": "Horizon 運行狀態與各隊列積壓",
        "running": "運行狀態",
        "normal": "正常",
        "abnormal": "異常",
        "waitTime": "當前等待時間：{{seconds}} 秒",
        "pending": "等待中",
        "processing": "處理中",
        "completed": "已完成",
        "failed": "失敗",
        "cancelled": "已取消"
      },
      "details": {
        "description": "隊列處理詳細信息",
        "recentJobs": "近期任務數",
        "statisticsPeriod": "統計時間範圍：{{hours}} 小時",
        "jobsPerMinute": "每分鐘處理量",
        "maxThroughput": "最高吞吐量：{{value}}",
        "failedJobs7Days": "7日報錯數量",
        "retentionPeriod": "保留 {{hours}} 小時",
        "longestRunningQueue": "最長運行隊列",
        "activeProcesses": "活躍進程",
        "id": "作業ID",
        "type": "作業類型",
        "status": "狀態",
        "progress": "進度",
        "createdAt": "創建時間",
        "updatedAt": "更新時間",
        "error": "錯誤信息",
        "data": "作業數據",
        "result": "結果",
        "duration": "耗時",
        "attempts": "重試次數",
        "nextRetry": "下次重試",
        "failedJobsDetailTitle": "失敗任務詳情",
        "viewFailedJobs": "查看報錯詳情",
        "jobDetailTitle": "任務詳細信息",
        "time": "時間",
        "queue": "隊列",
        "name": "任務名稱",
        "exception": "異常信息",
        "noException": "暫無異常信息",
        "noFailedJobs": "暫無失敗任務",
        "connection": "連接類型",
        "payload": "任務數據",
        "viewDetail": "查看詳情",
        "action": "操作"
      },
      "actions": {
        "retry": "重試",
        "cancel": "取消",
        "delete": "刪除",
        "viewDetails": "查看詳情"
      },
      "empty": "隊列中暫無作業",
      "loading": "正在加載隊列狀態...",
      "error": "加載隊列狀態失敗"
    },
    "common": {
      "refresh": "刷新",
      "close": "關閉",
      "pagination": "第 {{current}}/{{total}} 頁，共 {{count}} 條"
    },
    "search": {
      "loading": "搜索中...",
      "noResults": "未找到結果",
      "placeholder": "搜索菜單和功能...",
      "title": "菜單導航"
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
    "title": "訂單管理",
    "description": "在這裡可以查看用戶訂單，包括分配、查看、刪除等操作。",
    "table": {
      "columns": {
        "tradeNo": "訂單號",
        "type": "類型",
        "user": "用戶",
        "plan": "訂閱計劃",
        "period": "週期",
        "amount": "支付金額",
        "status": "訂單狀態",
        "commission": "佣金",
        "commissionStatus": "佣金狀態",
        "createdAt": "創建時間",
        "actions": "操作"
      }
    },
    "type": {
      "NEW": "新購",
      "RENEWAL": "續費",
      "UPGRADE": "升級",
      "RESET_FLOW": "流量重置",
      "DEPOSIT": "餘額充值"
    },
    "period": {
      "hour_price": "時付",
      "day_price": "日付",
      "month_price": "月付",
      "quarter_price": "季付",
      "half_year_price": "半年付",
      "year_price": "年付",
      "two_year_price": "兩年付",
      "three_year_price": "三年付",
      "onetime_price": "一次性",
      "reset_price": "流量重置包",
      "deposit": "餘額充值",
      "hourly": "小時",
      "daily": "天",
      "monthly": "月",
      "quarterly": "季度",
      "half_yearly": "半年",
      "yearly": "年",
      "two_yearly": "兩年",
      "three_yearly": "三年",
      "onetime": "一次性",
      "reset_traffic": "重置流量"
    },
    "status": {
      "PENDING": "待支付",
      "PROCESSING": "開通中",
      "CANCELLED": "已取消",
      "COMPLETED": "已完成",
      "DISCOUNTED": "已折抵",
      "tooltip": "標記為[已支付]後將會由系統進行開通後並完成"
    },
    "commission": {
      "PENDING": "待確認",
      "PROCESSING": "發放中",
      "VALID": "有效",
      "INVALID": "無效"
    },
    "filter": {
      "allTypes": "全部類型",
      "allPeriods": "全部週期",
      "allStatuses": "全部狀態",
      "allCommissions": "全部佣金狀態",
      "userId": "用戶 ID",
      "clear": "清除",
      "clearAll": "清除篩選"
    },
    "actions": {
      "view": "查看詳情",
      "markAsPaid": "標記為已支付",
      "cancel": "取消訂單",
      "issue": "發放佣金",
      "invalid": "無效佣金",
      "openMenu": "打開菜單",
      "reset": "重置",
      "copyTradeNo": "複製訂單號"
    },
    "search": {
      "placeholder": "搜索訂單號..."
    },
    "dialog": {
      "title": "訂單信息",
      "basicInfo": "基本信息",
      "amountInfo": "金額信息",
      "timeInfo": "時間信息",
      "commissionInfo": "佣金信息",
      "commissionStatusActive": "有效",
      "addOrder": "添加訂單",
      "assignOrder": "訂單分配",
      "fields": {
        "userEmail": "用戶郵箱",
        "userPhone": "用戶手機號",
        "orderPeriod": "訂單週期",
        "subscriptionPlan": "訂閱計劃",
        "callbackNo": "回調單號",
        "paymentAmount": "支付金額",
        "balancePayment": "餘額支付",
        "discountAmount": "優惠金額",
        "refundAmount": "退回金額",
        "deductionAmount": "折抵金額",
        "createdAt": "創建時間",
        "updatedAt": "更新時間",
        "commissionStatus": "佣金狀態",
        "commissionAmount": "佣金金額",
        "actualCommissionAmount": "實際佣金",
        "inviteUser": "邀請人",
        "inviteUserId": "邀請人ID"
      },
      "placeholders": {
        "email": "請輸入用戶郵箱",
        "plan": "請選擇訂閱計劃",
        "period": "請選擇購買時長",
        "amount": "請輸入需要支付的金額"
      },
      "actions": {
        "cancel": "取消",
        "confirm": "確定"
      },
      "messages": {
        "addSuccess": "添加成功",
        "addOrder": "添加訂單"
      }
    },
    "messages": {
      "addSuccess": "添加成功",
      "markPaidSuccess": "已標記為已支付",
      "cancelSuccess": "訂單已取消",
      "cancelConfirm": "確認取消該訂單？",
      "commissionIssueSuccess": "已發放佣金",
      "commissionInvalidSuccess": "已標記為無效佣金",
      "commissionInvalidConfirm": "確認將該佣金標記為無效？"
    }
  },
  "theme": {
    "title": "主題配置",
    "description": "主題配置，包括主題色、字體大小等。如果你採用前後分離的方式部署V2board，那麼主題配置將不會生效。",
    "upload": {
      "button": "上傳主題",
      "title": "上傳主題",
      "description": "請上傳一個有效的主題壓縮包（.zip 格式）。主題包應包含完整的主題文件結構。",
      "dragText": "將主題文件拖放到此處，或者",
      "clickText": "點擊選擇",
      "supportText": "支持 .zip 格式的主題包",
      "uploading": "正在上傳...",
      "success": "上傳成功",
      "error": {
        "format": "只支持上傳 ZIP 格式的主題文件"
      }
    },
    "preview": {
      "title": "主題預覽",
      "imageCount": "{{current}} / {{total}}"
    },
    "card": {
      "version": "版本: {{version}}",
      "currentTheme": "當前主題",
      "activateTheme": "激活主題",
      "activateSuccess": "已激活",
      "configureTheme": "主題設置",
      "preview": "預覽",
      "delete": {
        "title": "刪除主題",
        "description": "確定要刪除該主題嗎？刪除後無法恢復。",
        "button": "刪除",
        "error": {
          "active": "不能刪除當前使用的主題"
        }
      }
    },
    "config": {
      "title": "配置{{name}}主題",
      "description": "修改主題的樣式、佈局和其他顯示選項。",
      "cancel": "取消",
      "save": "保存",
      "success": "保存成功",
      "noConfigs": "該主題沒有可配置的選項",
      "error": "保存失敗"
    }
  }
};

window.FBOARD_TRANSLATIONS = window.FBOARD_TRANSLATIONS ?? {};
window.FBOARD_TRANSLATIONS["zh-TW"] = translations;
