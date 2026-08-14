import type { Translations } from "./global";

const translations: Translations = {
  "giftCard": {
    "title": "Управление подарочными картами",
    "description": "Управление шаблонами подарочных карт, кодами активации и записями об использовании.",
    "tabs": {
      "templates": "Управление шаблонами",
      "codes": "Коды активации",
      "usages": "История использования",
      "statistics": "Статистика"
    },
    "template": {
      "title": "Управление шаблонами",
      "description": "Создание, редактирование и удаление шаблонов подарочных карт.",
      "table": {
        "title": "Список шаблонов",
        "columns": {
          "id": "ID",
          "name": "Название",
          "type": "Тип",
          "status": "Статус",
          "sort": "Сортировка",
          "rewards": "Награды",
          "created_at": "Дата создания",
          "actions": "Действия",
          "no_rewards": "Нет наград"
        }
      },
      "form": {
        "add": "Добавить шаблон",
        "edit": "Изменить шаблон",
        "name": {
          "label": "Название шаблона",
          "placeholder": "Введите название шаблона",
          "required": "Пожалуйста, введите название шаблона"
        },
        "sort": {
          "label": "Сортировка",
          "placeholder": "Меньшие числа отображаются первыми"
        },
        "type": {
          "label": "Тип",
          "placeholder": "Выберите тип карты"
        },
        "description": {
          "label": "Описание",
          "placeholder": "Введите описание подарочной карты"
        },
        "status": {
          "label": "Статус",
          "description": "Если отключено, этот шаблон нельзя использовать для создания или активации новых карт."
        },
        "display": {
          "title": "Визуальные эффекты",
          "theme_color": {
            "label": "Цвет темы"
          },
          "icon": {
            "label": "Иконка",
            "placeholder": "Введите URL иконки"
          },
          "background_image": {
            "label": "Фоновое изображение",
            "placeholder": "Введите URL фонового изображения"
          }
        },
        "conditions": {
          "title": "Условия использования",
          "new_user_max_days": {
            "label": "Лимит дней регистрации нового пользователя",
            "placeholder": "Пример: 7 (Только для пользователей, зарегистрированных в течение 7 дней)"
          },
          "new_user_only": {
            "label": "Только для новых пользователей",
            "hint": "Дней с регистрации ≤ {{days}}"
          },
          "paid_user_only": {
            "label": "Только для платных пользователей"
          },
          "require_invite": {
            "label": "Требуется наличие пригласителя"
          },
          "allowed_plans": {
            "label": "Разрешенные тарифы",
            "placeholder": "Выберите тарифы, доступные для активации (оставьте пустым для всех)"
          },
          "disallowed_plans": {
            "label": "Запрещенные тарифы",
            "placeholder": "Выберите тарифы, для которых активация запрещена"
          }
        },
        "limits": {
          "title": "Ограничения",
          "max_use_per_user": {
            "label": "Макс. использований на пользователя",
            "placeholder": "Оставьте пустым для безлимита"
          },
          "cooldown_hours": {
            "label": "Кулдаун (часы) для однотипных карт",
            "placeholder": "Оставьте пустым для безлимита"
          }
        },
        "rewards": {
          "title": "Награды",
          "invite_reward_rate": {
            "label": "Доля вознаграждения пригласителя",
            "placeholder": "Пример: 0.2 (означает 20%)",
            "description": "Если у пользователя есть пригласитель, его бонус = бонус пользователя × эта доля"
          },
          "balance": {
            "label": "Бонусный баланс (Валюта)",
            "short_label": "Баланс",
            "placeholder": "Введите сумму вознаграждения"
          },
          "transfer_enable": {
            "label": "Бонусный трафик (ГБ)",
            "short_label": "Трафик",
            "placeholder": "Введите объем трафика (ГБ)"
          },
          "expire_days": {
            "label": "Продление срока (дней)",
            "short_label": "Срок",
            "placeholder": "Введите количество дней"
          },
          "transfer": {
            "label": "Бонусный трафик (Байты)",
            "placeholder": "Введите объем трафика (байты)"
          },
          "days": {
            "label": "Продление срока (дней)",
            "placeholder": "Введите количество дней"
          },
          "device_limit": {
            "label": "Увеличить лимит устройств",
            "short_label": "Устройства",
            "placeholder": "Введите количество дополнительных устройств"
          },
          "reset_package": {
            "label": "Сбросить месячный трафик",
            "description": "Если включено, активация очистит использованный трафик текущего тарифа пользователя."
          },
          "reset_count": {
            "description": "Этот тип карты сбрасывает использование месячного трафика пользователя."
          },
          "task_card": {
            "description": "Награды для бонусных карт за задания настраиваются в системе заданий."
          },
          "plan_id": {
            "label": "Указанный тариф",
            "short_label": "Тариф",
            "placeholder": "Пожалуйста, выберите тариф"
          },
          "plan_validity_days": {
            "label": "Срок действия тарифа (дней)",
            "short_label": "Срок тарифа",
            "placeholder": "Оставьте пустым для срока по умолчанию"
          },
          "random_rewards": {
            "label": "Пул случайных наград",
            "add": "Добавить случайную награду",
            "weight": "Вес"
          }
        },
        "special_config": {
          "title": "Специальная конфигурация",
          "start_time": {
            "label": "Время начала события",
            "placeholder": "Выберите дату начала"
          },
          "end_time": {
            "label": "Время окончания события",
            "placeholder": "Выберите дату окончания"
          },
          "festival_bonus": {
            "label": "Множитель праздничной награды",
            "placeholder": "Пример: 1.5 (означает 1.5x)"
          }
        },
        "submit": {
          "saving": "Сохранение...",
          "save": "Сохранить"
        }
      },
      "actions": {
        "edit": "Изменить",
        "delete": "Удалить",
        "deleteConfirm": {
          "title": "Подтверждение удаления",
          "description": "Это действие навсегда удалит этот шаблон. Вы уверены, что хотите продолжить?",
          "confirmText": "Удалить"
        }
      }
    },
    "code": {
      "title": "Управление кодами активации",
      "form": {
        "generate": "Сгенерировать коды активации",
        "template_id": {
          "label": "Выберите шаблон",
          "placeholder": "Выберите шаблон для генерации кодов активации"
        },
        "count": {
          "label": "Количество кодов"
        },
        "prefix": {
          "label": "Кастомный префикс (опционально)"
        },
        "expires_hours": {
          "label": "Срок действия (часов)"
        },
        "max_usage": {
          "label": "Лимит использований кода"
        },
        "download_csv": "Экспорт в CSV",
        "submit": {
          "generating": "Генерация...",
          "generate": "Сгенерировать сейчас"
        }
      },
      "description": "Управление кодами активации: генерация, просмотр и экспорт.",
      "table": {
        "title": "Список кодов активации",
        "columns": {
          "id": "ID",
          "code": "Код активации",
          "template_name": "Название шаблона",
          "status": "Статус",
          "expires_at": "Истекает",
          "usage_count": "Использовано",
          "max_usage": "Доступно",
          "created_at": "Дата создания"
        }
      },
      "actions": {
        "enable": "Включить",
        "disable": "Отключить",
        "export": "Экспорт",
        "exportConfirm": {
          "title": "Подтверждение экспорта",
          "description": "Все коды из выбранной группы будут экспортированы в текстовый файл. Продолжить?",
          "confirmText": "Экспорт"
        }
      },
      "status": {
        "0": "Не использован",
        "1": "Использован",
        "2": "Истек",
        "3": "Отключен"
      },
      "edit": {
        "title": "Редактировать код",
        "code": "Подарочный код",
        "template": "Шаблон",
        "templatePlaceholder": "Выберите шаблон",
        "maxUsage": "Макс. использований",
        "status": "Статус",
        "expiresAt": "Истекает"
      },
      "messages": {
        "enabled": "Включено",
        "disabled": "Отключено",
        "exportSuccess": "Экспорт выполнен",
        "deleteConfirmTitle": "Подтвердить удаление",
        "deleteConfirmDescription": "Удалить код {{code}}? Это действие нельзя отменить.",
        "deleteSuccess": "Удалено",
        "selectTemplate": "Выберите шаблон",
        "updateSuccess": "Обновлено"
      },
      "generate": {
        "count": "Количество",
        "expires_hours": "Срок действия (часы)",
        "max_usage": "Макс. использований",
        "prefix": "Пользовательский префикс",
        "submit": "Сгенерировать",
        "template": "Выберите шаблон",
        "title": "Генерация кодов"
      }
    },
    "usage": {
      "title": "История использования",
      "description": "Просмотр записей об использовании подарочных карт.",
      "table": {
        "columns": {
          "id": "ID",
          "code": "Код активации",
          "template_name": "Название шаблона",
          "user_email": "Email пользователя",
          "rewards_given": "Выданные награды",
          "invite_rewards": "Бонус пригласителя",
          "multiplier_applied": "Применен множитель",
          "ip_address": "IP адрес",
          "created_at": "Время использования",
          "actions": "Действия"
        }
      },
      "actions": {
        "view": "Детали"
      }
    },
    "statistics": {
      "title": "Статистика",
      "description": "Анализ использования подарочных карт.",
      "total": {
        "title": "Общая статистика",
        "templates_count": "Всего шаблонов",
        "active_templates_count": "Активных шаблонов",
        "codes_count": "Всего кодов активации",
        "used_codes_count": "Использовано кодов",
        "usages_count": "Записей об активации"
      },
      "daily": {
        "title": "Использование за день",
        "chart": "График использования"
      },
      "dateRange": {
        "end": "Дата окончания",
        "label": "Диапазон дат",
        "start": "Дата начала"
      },
      "type": {
        "chart": "Распределение по типам",
        "title": "Статистика по типам"
      }
    },
    "common": {
      "back": "Назад",
      "cancel": "Отмена",
      "close": "Закрыть",
      "confirm": "Подтвердить",
      "disabled": "Отключено",
      "enabled": "Включено",
      "error": "Ошибка операции",
      "export": "Экспорт",
      "filter": "Фильтр",
      "loading": "Загрузка...",
      "noData": "Нет данных",
      "refresh": "Обновить",
      "reset": "Сброс",
      "search": "Поиск подарочных карт...",
      "success": "Успешно"
    },
    "messages": {
      "codeGenerated": "Код успешно создан",
      "codeStatusUpdated": "Статус кода обновлён",
      "codesExported": "Коды экспортированы",
      "codesGenerated": "Коды успешно созданы",
      "createTemplateFailed": "Не удалось создать шаблон",
      "deleteTemplateFailed": "Не удалось удалить шаблон",
      "formInvalid": "Проверьте правильность заполнения формы",
      "generateCodeFailed": "Не удалось создать коды",
      "loadDataFailed": "Не удалось загрузить данные",
      "templateCreated": "Шаблон создан",
      "templateDeleted": "Шаблон удалён",
      "templateUpdated": "Шаблон обновлён",
      "updateCodeStatusFailed": "Не удалось обновить статус кода",
      "updateTemplateFailed": "Не удалось обновить шаблон"
    },
    "types": {
      "1": "Универсальная карта",
      "2": "Карта тарифа",
      "3": "Карта-сюрприз",
      "4": "Карта задания"
    }
  },
  "user": {
    "manage": {
      "title": "Управление пользователями",
      "description": "Здесь вы можете управлять пользователями, включая добавление, удаление, редактирование и поиск."
    },
    "columns": {
      "is_admin": "Админ",
      "is_staff": "Персонал",
      "id": "ID",
      "email": "Email",
      "online_count": "Устройства онлайн",
      "status": "Статус",
      "subscription": "Подписка",
      "group": "Группа",
      "used_traffic": "Использовано",
      "total_traffic": "Всего трафика",
      "expire_time": "Срок действия",
      "balance": "Баланс",
      "commission": "Комиссия",
      "register_time": "Дата регистрации",
      "invitee_email": "Приглашённый",
      "actions": "Действия",
      "next_reset_at": "След. сброс",
      "device_limit": {
        "unlimited": "Без лимита устройств",
        "limited": "Максимум {{count}} устройств"
      },
      "status_text": {
        "normal": "Активен",
        "banned": "Заблокирован"
      },
      "online_status": {
        "online": "В сети",
        "never": "Никогда не был в сети",
        "last_online": "Был в сети: {{time}}",
        "offline_duration": {
          "days": "Не в сети: {{count}}д",
          "hours": "Не в сети: {{count}}ч",
          "minutes": "Не в сети: {{count}}м",
          "seconds": "Не в сети: {{count}}с"
        }
      },
      "expire_status": {
        "permanent": "Бессрочно",
        "expired": "Истекло {{days}} дн. назад",
        "remaining": "Осталось {{days}} дн."
      },
      "copy_email": "Копировать email",
      "actions_menu": {
        "edit": "Редактировать",
        "view_details": "Просмотреть детали",
        "assign_order": "Назначить заказ",
        "copy_url": "Копировать ссылку подписки",
        "reset_secret": "Сбросить UUID и URL",
        "orders": "Заказы",
        "invites": "Приглашения",
        "traffic_records": "Записи трафика",
        "login_history": "История входов",
        "reset_traffic": "Сбросить трафик",
        "delete": "Удалить",
        "delete_confirm_title": "Подтверждение удаления пользователя",
        "delete_confirm_description": "Это действие навсегда удалит пользователя {{email}} и все связанные данные, включая заказы, купоны, записи трафика и тикеты. Это действие нельзя отменить. Продолжить?"
      }
    },
    "filter": {
      "selected": "Выбрано {{count}}",
      "clear_selection": "Снять выбор",
      "no_results": "Результатов не найдено.",
      "clear": "Очистить фильтры",
      "search_placeholder": "Поиск...",
      "email_search": "Поиск по email...",
      "advanced": "Расширенный фильтр",
      "reset": "Сбросить фильтр",
      "sheet": {
        "title": "Расширенный фильтр",
        "description": "Добавьте одно или несколько условий для точного поиска пользователей",
        "conditions": "Условия фильтрации",
        "add": "Добавить условие",
        "condition": "Условие {{number}}",
        "field": "Выберите поле",
        "operator": "Выберите оператор",
        "value": "Введите значение",
        "value_number": "Введите значение ({{unit}})",
        "reset": "Сброс",
        "apply": "Применить фильтр"
      },
      "fields": {
        "email": "Email",
        "phone": "Номер телефона",
        "id": "ID пользователя",
        "plan_id": "Подписка",
        "transfer_enable": "Трафик",
        "total_used": "Использовано",
        "online_count": "Устройства онлайн",
        "expired_at": "Срок действия",
        "uuid": "UUID",
        "token": "Токен",
        "banned": "Статус аккаунта",
        "remark": "Примечание",
        "inviter_email": "Email пригласителя",
        "invite_user_id": "ID пригласителя",
        "is_admin": "Админ",
        "is_staff": "Персонал"
      },
      "operators": {
        "contains": "Содержит",
        "eq": "Равно",
        "gt": "Больше",
        "lt": "Меньше"
      },
      "status": {
        "normal": "Нормальный",
        "banned": "Забанен"
      },
      "boolean": {
        "true": "Да",
        "false": "Нет"
      }
    },
    "generate": {
      "button": "Создать пользователя",
      "title": "Создание пользователя",
      "description_single": "Создать один аккаунт с указанным email",
      "description_batch": "Пакетная генерация аккаунтов со случайными email",
      "form": {
        "email": "Email",
        "email_prefix": "Префикс аккаунта (оставьте пустым для пакетной генерации)",
        "email_prefix_placeholder": "Оставьте пустым для случайной пакетной генерации",
        "email_domain": "Домен",
        "password": "Пароль",
        "password_placeholder": "Оставьте пустым, чтобы использовать email в качестве пароля",
        "expire_time": "Срок действия",
        "expire_time_placeholder": "Выберите срок действия, оставьте пустым для бессрочного",
        "permanent": "Бессрочно",
        "subscription": "Тарифный план",
        "subscription_none": "Нет",
        "generate_count": "Количество для генерации",
        "generate_count_placeholder": "Введите количество для пакетной генерации",
        "cancel": "Отмена",
        "submit": "Создать",
        "success": "Пользователи созданы",
        "download_csv": "Скачать как CSV",
        "generated_count": "Создано аккаунтов: {{count}}",
        "single_success_hint": "Аккаунт создан. Вы можете просмотреть и отредактировать его в списке пользователей.",
        "copy_all": "Копировать всё",
        "copy_email": "Копировать email",
        "copy_subscribe": "Копировать подписку",
        "result_password": "Пароль",
        "result_expire": "Срок"
      },
      "copy_line": {
        "email": "Email: {{value}}",
        "password": "Пароль: {{value}}",
        "expire": "Срок: {{value}}",
        "subscribe": "Подписка: {{value}}"
      },
      "csv": {
        "email": "Email",
        "password": "Пароль",
        "expire_time": "Срок действия",
        "uuid": "UUID",
        "created_at": "Дата создания",
        "subscribe_url": "Ссылка подписки"
      }
    },
    "edit": {
      "button": "Редактировать пользователя",
      "title": "Управление пользователем",
      "form": {
        "email": "Email",
        "phone_country": "Страна/регион",
        "phone": "Номер телефона",
        "phone_placeholder": "Введите номер телефона",
        "email_placeholder": "Пожалуйста, введите email",
        "inviter_email": "Email пригласителя",
        "inviter_email_placeholder": "Пожалуйста, введите email",
        "invite_user_id": "ID пригласителя",
        "invite_user_id_placeholder": "Введите ID пригласителя, оставьте пустым для очистки",
        "password": "Пароль",
        "password_placeholder": "Введите новый пароль, если хотите изменить его",
        "balance": "Баланс",
        "balance_placeholder": "Пожалуйста, введите баланс",
        "commission_balance": "Баланс комиссии",
        "commission_balance_placeholder": "Пожалуйста, введите баланс комиссии",
        "upload": "Трафик (загрузка)",
        "upload_placeholder": "Введите трафик загрузки",
        "download": "Трафик (скачивание)",
        "download_placeholder": "Введите трафик скачивания",
        "total_traffic": "Общий трафик",
        "total_traffic_placeholder": "Пожалуйста, введите трафик",
        "expire_time": "Срок действия",
        "expire_time_placeholder": "Выберите дату, оставьте пустым для бессрочного",
        "expire_time_specific": "Конкретное время",
        "expire_time_today": "До конца сегодня",
        "expire_time_permanent": "Бессрочно",
        "expire_time_1month": "Один месяц",
        "expire_time_3months": "Три месяца",
        "expire_time_confirm": "Подтвердить",
        "subscription": "Тарифный план",
        "subscription_none": "Нет",
        "account_status": "Статус аккаунта",
        "banned_hint": "Пользователь не может войти или использовать подписку",
        "normal_hint": "Пользователь может использовать все сервисы",
        "commission_type": "Тип комиссии",
        "commission_type_system": "По системным настройкам",
        "commission_type_cycle": "Циклическая комиссия",
        "commission_type_onetime": "Единоразовая комиссия",
        "commission_rate": "Ставка комиссии",
        "commission_rate_placeholder": "Оставьте пустым для системной ставки",
        "discount": "Эксклюзивная скидка",
        "discount_placeholder": "Оставьте пустым, если нет скидки",
        "speed_limit": "Лимит скорости",
        "speed_limit_placeholder": "Оставьте пустым для безлимита",
        "device_limit": "Лимит устройств",
        "device_limit_placeholder": "Оставьте пустым для безлимита",
        "is_admin": "Админ",
        "is_staff": "Персонал",
        "remarks": "Примечания",
        "remarks_placeholder": "Введите примечания здесь",
        "cancel": "Отмена",
        "submit": "Отправить",
        "success": "Изменено успешно"
      }
    },
    "actions": {
      "title": "Действия",
      "send_email": "Отправить Email",
      "export_csv": "Экспорт в CSV",
      "traffic_reset_stats": "Статистика сброса трафика",
      "batch_ban": "Пакетный бан",
      "confirm_ban": {
        "title": "Подтверждение пакетного бана",
        "filtered_description": "Это действие забанит всех пользователей, соответствующих вашим текущим фильтрам. Это нельзя отменить.",
        "all_description": "Это действие забанит всех пользователей в системе. Это нельзя отменить.",
        "cancel": "Отмена",
        "confirm": "Подтвердить бан",
        "banning": "Баню..."
      }
    },
    "messages": {
      "success": "Успех",
      "error": "Ошибка",
      "export": {
        "success": "Экспорт выполнен",
        "failed": "Ошибка экспорта"
      },
      "batch_ban": {
        "success": "Пакетный бан выполнен",
        "failed": "Ошибка пакетного бана"
      },
      "send_mail": {
        "success": "Email отправлен",
        "failed": "Ошибка отправки email",
        "required_fields": "Пожалуйста, заполните обязательные поля"
      },
      "reset_secret": {
        "success": "UUID и Token сброшены"
      }
    },
    "traffic_reset": {
      "title": "Сброс трафика",
      "description": "Сбросить трафик для пользователя {{email}}",
      "tabs": {
        "reset": "Сбросить трафик",
        "history": "История сбросов"
      },
      "user_info": "Информация о пользователе",
      "warning": {
        "title": "Важное уведомление",
        "irreversible": "Операция сброса трафика необратима, пожалуйста, будьте осторожны",
        "reset_to_zero": "После сброса трафик загрузки и скачивания пользователя будет обнулен",
        "logged": "Все операции сброса записываются в системные логи"
      },
      "reason": {
        "label": "Причина сброса",
        "placeholder": "Введите причину сброса (опционально)",
        "optional": "Это поле не обязательно и используется для записи причины сброса"
      },
      "confirm_reset": "Подтвердить сброс",
      "resetting": "Сбрасываю...",
      "reset_success": "Трафик сброшен успешно",
      "reset_failed": "Ошибка при сбросе трафика",
      "history": {
        "summary": "Обзор сбросов",
        "reset_count": "Количество сбросов",
        "last_reset": "Последний сброс",
        "next_reset": "Следующий сброс",
        "never": "Никогда не сбрасывался",
        "no_schedule": "Сброс не запланирован",
        "records": "Записи о сбросе",
        "recent_records": "Последние 10 записей",
        "no_records": "Записей о сбросе нет",
        "reset_time": "Время сброса",
        "traffic_cleared": "Трафик обнулен"
      },
      "stats": {
        "title": "Статистика сброса трафика",
        "description": "Просмотр системной статистики сброса трафика",
        "time_range": "Временной диапазон",
        "total_resets": "Всего сбросов",
        "auto_resets": "Автоматические",
        "manual_resets": "Ручные",
        "cron_resets": "По расписанию/Cron",
        "in_period": "За последние {{days}} дн.",
        "breakdown": "Разбивка по типам",
        "breakdown_description": "Процентное соотношение различных типов операций сброса",
        "auto_percentage": "Доля автосбросов",
        "manual_percentage": "Доля ручных сбросов",
        "cron_percentage": "Доля сбросов по Cron",
        "days_options": {
          "week": "За неделю",
          "month": "За месяц",
          "quarter": "За квартал",
          "year": "За год"
        }
      }
    },
    "traffic_reset_logs": {
      "title": "Логи сброса трафика",
      "description": "Просмотр подробных записей всех операций сброса трафика в системе",
      "columns": {
        "id": "ID лога",
        "user": "Пользователь",
        "reset_type": "Тип сброса",
        "trigger_source": "Источник",
        "cleared_traffic": "Обнуленный трафик",
        "cleared": "Обнулено",
        "upload": "Загрузка",
        "download": "Скачивание",
        "reset_time": "Время сброса",
        "log_time": "Время записи"
      },
      "filters": {
        "search_user": "Поиск по email...",
        "reset_type": "Тип сброса",
        "trigger_source": "Источник",
        "all_types": "Все типы",
        "all_sources": "Все источники",
        "start_date": "Дата начала",
        "end_date": "Дата окончания",
        "apply_date": "Применить фильтр",
        "reset": "Сбросить фильтр",
        "filter_title": "Параметры фильтрации",
        "filter_description": "Установите условия для поиска записей о сбросе трафика",
        "reset_types": {
          "monthly": "Ежемесячно",
          "first_day_month": "Первое число месяца",
          "yearly": "Ежегодно",
          "first_day_year": "Первое число года",
          "manual": "Вручную"
        },
        "trigger_sources": {
          "auto": "Автоматически",
          "manual": "Вручную",
          "cron": "По расписанию/Cron"
        }
      },
      "actions": {
        "export": "Экспорт логов",
        "exporting": "Экспортирую...",
        "export_success": "Экспорт выполнен успешно",
        "export_failed": "Ошибка экспорта"
      },
      "trigger_descriptions": {
        "manual": "Сброс трафика выполнен администратором вручную",
        "cron": "Сброс выполнен автоматически системной задачей (Cron)",
        "auto": "Автоматический сброс при выполнении условий системы",
        "other": "Сброс выполнен другим способом"
      }
    },
    "login_history": {
      "title": "История входов",
      "no_records": "Записей о входах нет",
      "columns": {
        "time": "Время",
        "ip": "IP",
        "method": "Способ",
        "user_agent": "User-Agent"
      },
      "methods": {
        "password": "Пароль",
        "register": "Регистрация",
        "mail_link": "Ссылка из письма"
      }
    },
    "send_mail": {
      "title": "Отправить Email",
      "description": "Отправить сообщение выбранным или отфильтрованным пользователям",
      "subject": "Тема",
      "content": "Содержимое",
      "sending": "Отправка...",
      "send": "Отправить"
    },
    "dialog": {
      "title": "Детали пользователя",
      "basicInfo": "Основная информация",
      "subscriptionInfo": "Информация о подписке",
      "trafficInfo": "Информация о трафике",
      "financialInfo": "Финансовая информация",
      "activityInfo": "Активность",
      "inviteInfo": "Реферальная информация",
      "timeInfo": "Временные метки",
      "subscriptionUrl": "Ссылка подписки",
      "fields": {
        "userId": "ID пользователя",
        "email": "Email",
        "phone": "Номер телефона",
        "uuid": "UUID",
        "token": "Токен",
        "remarks": "Примечания",
        "subscriptionPlan": "Тариф",
        "permissionGroup": "Группы доступа",
        "expiredAt": "Истекает",
        "deviceLimit": "Лимит устройств",
        "speedLimit": "Лимит скорости",
        "transferEnable": "Всего трафика",
        "uploadUsed": "Использовано (Up)",
        "downloadUsed": "Использовано (Down)",
        "totalUsed": "Всего использовано",
        "lastResetAt": "Последний сброс",
        "nextResetAt": "Следующий сброс",
        "resetCount": "Кол-во сбросов",
        "balance": "Баланс",
        "commissionBalance": "Баланс комиссии",
        "commissionType": "Тип комиссии",
        "commissionRate": "Ставка комиссии",
        "lastLoginAt": "Последний вход",
        "lastLoginIp": "IP последнего входа",
        "registerIp": "IP регистрации",
        "lastOnlineAt": "Последний раз онлайн",
        "onlineCount": "Устройства онлайн",
        "inviteUser": "Пригласитель",
        "inviteUserId": "ID пригласителя",
        "createdAt": "Дата создания",
        "updatedAt": "Дата обновления",
        "subscribeUrl": "Ссылка подписки",
        "telegramId": "Telegram ID"
      }
    },
    "status": {
      "normal": "Нормальный",
      "banned": "Забанен",
      "admin": "Админ",
      "staff": "Персонал"
    }
  },
  "nav": {
    "dashboard": "Панель управления",
    "systemManagement": "Управление системой",
    "systemConfig": "Настройки системы",
    "themeConfig": "Настройки темы",
    "noticeManagement": "Управление уведомлениями",
    "pluginManagement": "Управление плагинами",
    "paymentConfig": "Настройки оплаты",
    "knowledgeManagement": "База знаний",
    "nodeManagement": "Управление узлами",
    "machineManagement": "Управление серверами",
    "permissionGroupManagement": "Группы доступа",
    "routeManagement": "Управление маршрутами",
    "subscriptionManagement": "Подписки",
    "planManagement": "Тарифные планы",
    "orderManagement": "Управление заказами",
    "couponManagement": "Купоны",
    "giftCardManagement": "Подарочные карты",
    "userManagement": "Пользователи",
    "trafficResetLogs": "Логи сброса трафика",
    "ticketManagement": "Тикеты",
    "withdrawalManagement": "Выплаты",
    "pluginApps": "Приложения плагинов",
    "pluginMenuDemo": "Меню плагина (демо)"
  },
  "subscribe": {
    "plan": {
      "title": "Тарифные планы",
      "add": "Добавить план",
      "search": "Поиск планов...",
      "sort": {
        "edit": "Изменить порядок",
        "save": "Сохранить порядок"
      },
      "columns": {
        "id": "ID",
        "show": "Показывать",
        "sell": "Продавать",
        "renew": "Продление",
        "renew_tooltip": "Могут ли существующие пользователи продлевать подписку, когда она снята с продажи",
        "name": "Название",
        "users": "Всего пользователей",
        "active_users": "Активные",
        "stats": "Статистика",
        "group": "Группа доступа",
        "price": "Цена",
        "actions": "Действия",
        "edit": "Изменить",
        "delete": "Удалить",
        "delete_confirm": {
          "title": "Подтверждение удаления",
          "description": "Это действие навсегда удалит этот тарифный план. Вы уверены, что хотите продолжить?",
          "success": "Тариф успешно удален"
        },
        "price_period": {
          "hourly": "Почасово",
          "daily": "Ежедневно",
          "monthly": "Ежемесячно",
          "quarterly": "Ежеквартально",
          "half_yearly": "Раз в полгода",
          "yearly": "Ежегодно",
          "two_yearly": "Раз в 2 года",
          "three_yearly": "Раз в 3 года",
          "onetime": "Единоразово",
          "reset_traffic": "Сброс трафика",
          "no_price": "Нет цены",
          "unit": {
            "hour": "/час",
            "day": "/день",
            "month": "/мес",
            "quarter": "/квартал",
            "half_year": "/полгода",
            "year": "/год",
            "two_year": "/2 года",
            "three_year": "/3 года",
            "times": "/раз"
          }
        }
      },
      "form": {
        "add_title": "Добавить тариф",
        "edit_title": "Изменить тариф",
        "name": {
          "label": "Название тарифа",
          "placeholder": "Введите название тарифа",
          "required": "Укажите название тарифа"
        },
        "group": {
          "label": "Группа доступа",
          "add": "Добавить группу доступа",
          "placeholder": "Выберите группу доступа",
          "none": "Без группы доступа"
        },

        "transfer": {
          "label": "Трафик",
          "placeholder": "Введите лимит трафика",
          "unit": "ГБ",
          "hint": "Квота трафика тарифа в ГБ"
        },
        "speed": {
          "label": "Ограничение скорости",
          "placeholder": "0 = без лимита",
          "unit": "Мбит/с",
          "hint": "Лимит скорости на пользователя; 0 или пусто — без ограничений"
        },
        "price": {
          "title": "Настройки цены",
          "base_price": "Базовая цена",
          "clear": {
            "button": "Очистить",
            "tooltip": "Очистить все цены"
          },
          "period": {
            "monthly": "Добавить",
            "months": "{{count}} Мес."
          },
          "onetime_desc": "Единоразовый пакет трафика, без ограничения по времени",
          "reset_desc": "Пакет сброса трафика, может быть использован многократно"
        },
        "device": {
          "label": "Лимит устройств",
          "placeholder": "0 = без лимита",
          "unit": "Устройств",
          "hint": "Одновременные устройства; 0 или пусто — без ограничений"
        },
        "capacity": {
          "label": "Лимит пользователей",
          "placeholder": "0 = без лимита",
          "unit": "Пользователей",
          "hint": "Макс. число мест; 0 или пусто — без ограничений"
        },
        "tags": {
          "label": "Теги",
          "placeholder": "Введите тег и нажмите Enter"
        },
        "reset_method": {
          "label": "Метод сброса трафика",
          "placeholder": "Выберите метод сброса",
          "description": "Метод сброса определяет, когда и как будет сброшен трафик пользователя",
          "options": {
            "follow_system": "Следовать системным настройкам",
            "monthly_first": "Первое число каждого месяца",
            "monthly_reset": "Ежемесячно (в день покупки)",
            "no_reset": "Без сброса",
            "yearly_first": "Первое число года",
            "yearly_reset": "Ежегодно (в день покупки)"
          }
        },
        "content": {
          "label": "Описание тарифа",
          "placeholder": "Введите описание тарифа",
          "description": "Поддерживается формат Markdown",
          "preview": "Предпросмотр",
          "preview_button": {
            "show": "Показать предпросмотр",
            "hide": "Скрыть предпросмотр"
          },
          "template": {
            "button": "Использовать шаблон",
            "tooltip": "Использовать стандартный шаблон",
            "content": "## Детали плана\n\n- Трафик: {{transfer}} ГБ\n- Скорость: {{speed}} Мбит/с\n- Устройств: {{devices}}\n\n## Информация о сервисе\n\n1. Сброс трафика: {{reset_method}}\n2. Поддержка всех платформ\n3. Техподдержка 24/7"
          }
        },
        "section": {
          "basic": "Основное",
          "limits": "Квоты и лимиты",
          "content": "Описание",
          "status": "Доступность"
        },
        "status": {
          "show_desc": "Показывать тариф в витрине",
          "sell_desc": "Разрешить новые покупки",
          "renew_desc": "Разрешить продление существующим пользователям"
        },
        "force_update": {
          "label": "Принудительно обновить планы пользователей",
          "description": "Если включено, при сохранении будут перезаписаны группа, трафик, лимит скорости и лимит устройств пользователей этого тарифа. Применяется только при редактировании существующего тарифа."
        },
        "submit": {
          "cancel": "Отмена",
          "submit": "Отправить",
          "submitting": "Отправка...",
          "success": {
            "add": "Тариф успешно добавлен",
            "update": "Тариф успешно обновлен"
          },
          "error": {
            "validation": "Ошибка валидации формы. Пожалуйста, проверьте данные."
          }
        }
      },
      "page": {
        "description": "Здесь вы можете настраивать тарифные планы, включая операции добавления, удаления и редактирования."
      }
    }
  },
  "settings": {
    "title": "Системные настройки",
    "description": "Управление основными конфигурациями системы, включая сайт, безопасность, подписки, реферальную программу, узлы и уведомления.",
    "server": {
      "title": "Конфигурация сервера",
      "description": "Настройка связи и синхронизации узлов, включая ключи связи, интервалы опроса, балансировку нагрузки и другие параметры.",
      "server_token": {
        "title": "Токен связи",
        "placeholder": "Введите токен связи",
        "description": "Используется для аутентификации между серверами и панелью",
        "generate_tooltip": "Нажмите для генерации случайного токена"
      },
      "server_pull_interval": {
        "title": "Интервал получения данных (Pull)",
        "description": "Частота, с которой узлы запрашивают данные из панели.",
        "placeholder": "Введите интервал"
      },
      "server_push_interval": {
        "title": "Интервал отправки данных (Push)",
        "description": "Частота, с которой узлы отправляют статистику в панель.",
        "placeholder": "Введите интервал"
      },
      "device_limit_mode": {
        "title": "Режим лимита устройств",
        "description": "В мягком режиме несколько узлов с одного IP считаются как одно устройство.",
        "strict": "Строгий режим",
        "relaxed": "Мягкий режим",
        "placeholder": "Выберите режим лимита"
      },
      "server_ws_enable": {
        "title": "Включить связь через WebSocket",
        "description": "При включении узлы будут связываться с панелью через WebSocket для снижения задержки.",
        "supported_clients": "Клиенты, поддерживающие WebSocket: Fboard-Node"
      },
      "server_ws_url": {
        "title": "URL WebSocket",
        "description": "Адрес WebSocket для подключения узлов. Оставьте пустым, чтобы использовать URL сайта.",
        "placeholder": "Оставьте пустым для URL сайта"
      },
      "server_ws_log_enable": {
        "title": "Отладочные логи WebSocket",
        "description": "При включении пишутся [WS]-события: подключение узлов/машин, полная синхронизация, push. По умолчанию выключено, чтобы не засорять логи при большом числе узлов; предупреждения пишутся всегда. Изменения вступают в силу за несколько секунд без перезапуска."
      },
      "node_install_script_url": {
        "title": "URL скрипта установки узла",
        "description": "Пользовательский URL скрипта установки узла. Оставьте пустым, чтобы использовать URL по умолчанию из GitHub.",
        "placeholder": "Оставьте пустым для URL по умолчанию"
      },
      "utls_fingerprints": {
        "title": "Список отпечатков uTLS",
        "description": "Конкретные отпечатки для «uTLS → отпечаток» при редактировании узла. Поддерживаются chrome / firefox / safari / ios / android / edge / qq и другие имена клиентов. random (случайный выбор при подписке) и randomized (на стороне клиента) всегда добавляются системой и здесь не настраиваются.",
        "placeholder": "Введите имя отпечатка и нажмите Enter, например chrome"
      },
      "saving": "Сохранение...",
      "manage": {
        "description": "Управление всеми узлами: добавление, удаление и редактирование.",
        "title": "Управление узлами"
      }
    },
    "invite": {
      "title": "Реферальная программа",
      "description": "Настройка регистрации по приглашениям и комиссионных вознаграждений.",
      "invite_force": {
        "title": "Принудительное приглашение",
        "description": "Если включено, регистрация доступна только по пригласительному коду."
      },
      "invite_commission": {
        "title": "Процент комиссии",
        "description": "Процент вознаграждения по умолчанию. Можно настроить индивидуально для каждого пользователя.",
        "placeholder": "Введите процент"
      },
      "invite_gen_limit": {
        "title": "Лимит генерации кодов",
        "description": "Максимальное количество кодов, которое может создать пользователь.",
        "placeholder": "Введите лимит"
      },
      "invite_never_expire": {
        "title": "Бессрочные коды",
        "description": "Если включено, коды не сгорают после использования."
      },
      "commission_first_time": {
        "title": "Комиссия только за первую покупку",
        "description": "Вознаграждение начисляется только за первый платеж приглашенного."
      },
      "commission_auto_check": {
        "title": "Автоматическое подтверждение",
        "description": "Комиссия подтверждается автоматически через 3 дня после завершения заказа."
      },
      "commission_withdraw_limit": {
        "title": "Минимальная сумма вывода",
        "description": "Запросы на вывод ниже этой суммы не принимаются.",
        "placeholder": "Введите сумму"
      },
      "commission_withdraw_method": {
        "title": "Методы вывода",
        "description": "Поддерживаемые способы вывода средств, разделяйте запятыми.",
        "placeholder": "Введите методы (напр. USDT, Карта)"
      },
      "withdraw_close": {
        "title": "Отключить вывод средств",
        "description": "Если включено, пользователи не могут запрашивать вывод, комиссия идет сразу на баланс."
      },
      "commission_distribution": {
        "title": "Трехуровневая система",
        "description": "Распределение комиссии по трем уровням пригласителей. Сумма не должна превышать 100%.",
        "l1": "Уровень 1 (%)",
        "l2": "Уровень 2 (%)",
        "l3": "Уровень 3 (%)",
        "placeholder": "Введите процент"
      },
      "distribution_total": "Текущая сумма распределения: {{total}}% (не должна превышать 100%)",
      "saving": "Сохранение..."
    },
    "site": {
      "title": "Настройки сайта",
      "description": "Базовая информация о сайте: название, описание, валюта и другие параметры.",
      "form": {
        "siteName": {
          "label": "Название сайта",
          "placeholder": "Введите название",
          "description": "Отображается в заголовках и интерфейсе."
        },
        "siteDescription": {
          "label": "Описание сайта",
          "placeholder": "Введите описание",
          "description": "Используется для SEO и подзаголовков."
        },
        "siteUrl": {
          "label": "URL сайта",
          "placeholder": "Напр. https://domain.com (без / в конце)",
          "description": "Используется в ссылках, письмах и API."
        },
        "forceHttps": {
          "label": "Принудительный HTTPS",
          "description": "Включите, если сайт за прокси/CDN с HTTPS, но сам сервер работает без него."
        },
        "maintenanceMode": {
          "label": "Режим обслуживания",
          "description": "При включении изменения данных и прокси-трафик пользователей приостанавливаются, а администратор может отключить режим в панели."
        },
        "logo": {
          "label": "Логотип (URL)",
          "placeholder": "URL вашего логотипа",
          "description": "Ссылка на изображение логотипа."
        },
        "subscribeUrl": {
          "label": "URL подписки (кастомный)",
          "placeholder": "Разделяйте ',', оставьте пустым для URL сайта",
          "description": "URL для генерации ссылок подписки."
        },
        "tosUrl": {
          "label": "URL условий (TOS)",
          "placeholder": "Ссылка на правила сервиса",
          "description": "Ссылка на страницу правил использования."
        },
        "stopRegister": {
          "label": "Отключить регистрацию",
          "description": "Запретить регистрацию новых пользователей."
        },
        "ticketMustWaitReply": {
          "label": "Ожидание ответа в тикетах",
          "description": "Пользователь не может отправить новое сообщение, пока админ не ответит."
        },
        "tryOut": {
          "label": "Пробный тариф",
          "placeholder": "Выберите тариф",
          "description": "Выберите тариф для триала при регистрации.",
          "no_plan": "Отключено",
          "duration": {
            "label": "Длительность (часов)",
            "placeholder": "0",
            "description": "Время действия пробного периода."
          }
        },
        "currency": {
          "label": "Код валюты",
          "placeholder": "RUB",
          "description": "Отображаемый код (влияет на весь интерфейс)."
        },
        "currencySymbol": {
          "label": "Символ валюты",
          "placeholder": "₽",
          "description": "Отображаемый символ (влияет на весь интерфейс)."
        }
      }
    },
    "safe": {
      "title": "Безопасность",
      "description": "Настройки защиты: капча, лимиты паролей, белые списки Email и другие параметры.",
      "form": {
        "emailVerify": {
          "label": "Верификация Email",
          "description": "Обязательное подтверждение почты при регистрации."
        },
        "gmailLimit": {
          "label": "Запретить алиасы Gmail",
          "description": "Запретить регистрацию с использованием '+' в адресах Gmail."
        },
        "safeMode": {
          "label": "Безопасный режим домена",
          "description": "Доступ к сайту только через указанный URL (остальные 403)."
        },
        "securePath": {
          "label": "Путь к админ-панели",
          "placeholder": "admin",
          "description": "Изменение стандартного адреса входа в админку."
        },
        "emailWhitelist": {
          "label": "Белый список доменов почты",
          "description": "Разрешить регистрацию только для указанных доменов.",
          "suffixes": {
            "label": "Домены почты",
            "placeholder": "Один домен на строку (напр. gmail.com)",
            "description": "Список разрешенных почтовых сервисов."
          }
        },
        "captcha": {
          "enable": {
            "label": "Включить капчу",
            "description": "Проверка пользователя при регистрации."
          },
          "type": {
            "label": "Тип капчи",
            "description": "Выберите сервис проверки",
            "options": {
              "recaptcha": "Google reCAPTCHA v2",
              "recaptcha-v3": "Google reCAPTCHA v3",
              "turnstile": "Cloudflare Turnstile"
            }
          },
          "recaptcha": {
            "key": {
              "label": "Secret Key",
              "placeholder": "Введите Secret Key",
              "description": "Ваш секретный ключ reCAPTCHA"
            },
            "siteKey": {
              "label": "Site Key",
              "placeholder": "Введите Site Key",
              "description": "Ваш публичный ключ reCAPTCHA"
            }
          },
          "recaptcha_v3": {
            "secretKey": {
              "label": "v3 Secret Key",
              "placeholder": "Введите v3 Secret Key",
              "description": "Секретный ключ v3"
            },
            "siteKey": {
              "label": "v3 Site Key",
              "placeholder": "Введите v3 Site Key",
              "description": "Публичный ключ v3"
            },
            "scoreThreshold": {
              "label": "Порог оценки (Score)",
              "placeholder": "0.5",
              "description": "Порог (0-1), где выше — более вероятно человек."
            }
          },
          "turnstile": {
            "secretKey": {
              "label": "Turnstile Secret Key",
              "placeholder": "Введите секретный ключ",
              "description": "Ключ от Cloudflare Turnstile"
            },
            "siteKey": {
              "label": "Turnstile Site Key",
              "placeholder": "Введите Site Key",
              "description": "Публичный ключ Turnstile"
            }
          }
        },
        "registerLimit": {
          "enable": {
            "label": "Лимит регистраций по IP",
            "description": "Ограничение количества аккаунтов с одного адреса."
          },
          "count": {
            "label": "Кол-во регистраций",
            "placeholder": "Максимум аккаунтов",
            "description": "Сколько раз можно зарегистрироваться с одного IP."
          },
          "expire": {
            "label": "Длительность (мин)",
            "placeholder": "Время блокировки",
            "description": "Через сколько минут лимит сбросится."
          }
        },
        "passwordLimit": {
          "enable": {
            "label": "Лимит попыток входа",
            "description": "Защита от брутфорса паролей."
          },
          "count": {
            "label": "Кол-во попыток",
            "placeholder": "Макс. попыток входа",
            "description": "Допустимое количество неверных паролей."
          },
          "expire": {
            "label": "Время блокировки (мин)",
            "placeholder": "Длительность бана",
            "description": "На сколько минут блокируется вход."
          }
        }
      }
    },
    "subscribe": {
      "title": "Настройки подписки",
      "description": "Управление форматом ссылок, частотой обновления, статистикой трафика и другими параметрами подписок.",
      "plan_change_enable": {
        "title": "Разрешить смену тарифа",
        "description": "Позволить пользователям переходить на другие планы самостоятельно."
      },
      "reset_traffic_method": {
        "title": "Метод глобального сброса трафика",
        "description": "Настройка сброса по умолчанию (1-е число месяца). Можно переопределить в тарифах.",
        "options": {
          "monthly_first": "1-е число месяца",
          "monthly_reset": "Ежемесячно (день покупки)",
          "no_reset": "Без сброса",
          "yearly_first": "1 января каждого года",
          "yearly_reset": "Раз в год (день покупки)"
        }
      },
      "surplus_enable": {
        "title": "Режим зачета средств",
        "description": "При смене тарифа остаток средств со старого плана пойдет в счет нового."
      },
      "new_order_event": {
        "title": "Событие при новой подписке",
        "description": "Что сделать, когда пользователь покупает новый тариф.",
        "options": {
          "no_action": "Ничего",
          "reset_traffic": "Сбросить использованный трафик"
        }
      },
      "renew_order_event": {
        "title": "Событие при продлении",
        "description": "Что сделать при оплате продления тарифа.",
        "options": {
          "no_action": "Ничего",
          "reset_traffic": "Сбросить использованный трафик"
        }
      },
      "change_order_event": {
        "title": "Событие при смене тарифа",
        "description": "Что сделать при переходе на другой тариф.",
        "options": {
          "no_action": "Ничего",
          "reset_traffic": "Сбросить использованный трафик"
        }
      },
      "subscribe_path": {
        "title": "Путь подписки",
        "description": "Формат ссылки. Изменение повлияет на все существующие ссылки.",
        "current_format": "Текущий формат: {path}/xxxxxxxxxx",
        "restart_tip": "Может потребоваться перезапуск сервиса для применения."
      },
      "show_info_to_server": {
        "title": "Инфо в подписке (клиент)",
        "description": "Показывать информацию о трафике и сроке действия в приложении пользователя."
      },
      "show_protocol_to_server": {
        "title": "Протокол в имени узла",
        "description": "Добавлять название протокола к узлам (напр. [Hy2] Hong Kong)."
      },
      "default_remind_expire": {
        "title": "Уведомление об истечении по умолчанию",
        "description": "Новые пользователи по умолчанию получают уведомления об истечении подписки. Можно изменить в карточке пользователя."
      },
      "default_remind_traffic": {
        "title": "Уведомление о трафике по умолчанию",
        "description": "Новые пользователи по умолчанию получают уведомления о низком остатке трафика. Можно изменить в карточке пользователя."
      },
      "deposit_enable": {
        "title": "Включить пополнение баланса",
        "description": "Если включено, пользователи могут создавать заказы на пополнение и зачислять средства после оплаты."
      },
      "deposit_commission_enable": {
        "title": "Пополнение участвует в реферальной комиссии",
        "description": "Если включено, заказы на пополнение учитываются при расчёте реферальной комиссии."
      },
      "deposit_min_amount": {
        "title": "Минимальная сумма пополнения (центы)",
        "description": "Минимальная сумма одного пополнения в центах. Например, 100 означает 1.00.",
        "placeholder": "100"
      },
      "deposit_max_amount": {
        "title": "Максимальная сумма пополнения (центы)",
        "description": "Максимальная сумма одного пополнения в центах.",
        "placeholder": "999999900"
      },
      "deposit_bonus": {
        "title": "Бонусные уровни пополнения",
        "description": "Формат «порог:бонус» в основных единицах, например 100:10 — пополнение на 100 даёт 10 бонуса. Берётся наибольший подходящий уровень.",
        "placeholder": "100:10"
      },
      "saving": "Сохранение...",
      "plan": {
        "title": "Тарифные планы",
        "add": "Добавить",
        "search": "Поиск...",
        "sort": {
          "edit": "Сортировка",
          "save": "Сохранить"
        },
        "columns": {
          "id": "ID",
          "show": "Показ",
          "sell": "Продажа",
          "renew": "Продл.",
          "renew_tooltip": "Можно ли продлевать, если тариф снят с продажи",
          "name": "Название",
          "stats": "Стат.",
          "group": "Группа",
          "price": "Цена",
          "actions": "Действия",
          "edit": "Изм.",
          "delete": "Уд.",
          "delete_confirm": {
            "title": "Удаление",
            "description": "Это действие нельзя отменить. Продолжить?",
            "success": "Удалено"
          },
          "price_period": {
            "hourly": "Час",
            "daily": "День",
            "monthly": "Месяц",
            "quarterly": "Квартал",
            "half_yearly": "Полгода",
            "yearly": "Год",
            "two_yearly": "2 Года",
            "three_yearly": "3 Года",
            "onetime": "Единоразово",
            "reset_traffic": "Сброс трафика",
            "unit": {
              "hour": "/час",
              "day": "/день",
              "month": "/мес",
              "quarter": "/кв",
              "half_year": "/п-года",
              "year": "/год",
              "two_year": "/2г",
              "three_year": "/3г",
              "times": "/раз"
            }
          }
        },
        "form": {
          "add_title": "Добавить тариф",
          "edit_title": "Изменить тариф",
          "name": {
            "label": "Название",
            "placeholder": "Введите название"
          },
          "group": {
            "label": "Группа доступа",
            "placeholder": "Выберите группу",
            "add": "Добавить",
            "none": "Без группы доступа"
          },
          "transfer": {
            "label": "Трафик",
            "placeholder": "Объем трафика",
            "unit": "ГБ"
          },
          "speed": {
            "label": "Лимит скорости",
            "placeholder": "Макс. скорость",
            "unit": "Мбит/с"
          },
          "price": {
            "title": "Настройка цены",
            "base_price": "Базовая цена",
            "clear": {
              "button": "Очистить",
              "tooltip": "Удалить все цены"
            }
          },
          "device": {
            "label": "Лимит устройств",
            "placeholder": "Без лимита",
            "unit": "шт"
          },
          "capacity": {
            "label": "Лимит емкости",
            "placeholder": "Без лимита",
            "unit": "чел"
          },
          "reset_method": {
            "label": "Способ сброса",
            "placeholder": "Выберите способ",
            "description": "Как будет считаться трафик для этого тарифа.",
            "options": {
              "follow_system": "Как в системе",
              "monthly_first": "1-е число месяца",
              "monthly_reset": "День покупки",
              "no_reset": "Без сброса",
              "yearly_first": "1 января",
              "yearly_reset": "Раз в год"
            }
          },
          "content": {
            "label": "Описание тарифа",
            "placeholder": "Введите описание...",
            "description": "Markdown разрешен. Списки, жирный текст и т.д.",
            "preview": "Предпросмотр",
            "preview_button": {
              "show": "Показать",
              "hide": "Скрыть"
            },
            "template": {
              "button": "Шаблон",
              "tooltip": "Вставить стандартное описание",
              "content": "## Особенности тарифа\n• Высокая скорость и стабильность\n• Поддержка нескольких устройств\n• Регулярный сброс трафика\n\n## Инструкции\n1. Поддержка: iOS, Android, Windows, macOS\n2. Техподдержка 24/7\n3. Автообновление трафика\n\n## Важно\n- Запрещен абуз\n- Соблюдайте законодательство\n- Можно сменить тариф в любой момент"
            }
          },
          "force_update": {
            "label": "Принудительно обновить у всех",
            "description": "Если включено, при сохранении будут перезаписаны группа, трафик, лимит скорости и лимит устройств пользователей этого тарифа."
          },
          "submit": {
            "submitting": "Сохранение...",
            "submit": "Применить",
            "cancel": "Отмена",
            "success": {
              "add": "Тариф добавлен",
              "update": "Тариф обновлен"
            }
          }
        },
        "page": {
          "description": "Настройка тарифных планов: лимиты, цены и видимость."
        }
      }
    },
    "email": {
      "title": "Настройки почты",
      "description": "Настройка SMTP для отправки кодов подтверждения, восстановления пароля и системных уведомлений.",
      "tab_settings": "Настройки",
      "tab_templates": "Шаблоны",
      "email_host": {
        "title": "SMTP Сервер",
        "description": "Адрес сервера, напр. smtp.gmail.com",
        "placeholder": "smtp.example.com"
      },
      "email_port": {
        "title": "SMTP Порт",
        "description": "Обычно: 465 (SSL) или 587 (TLS)",
        "placeholder": "465"
      },
      "email_username": {
        "title": "Имя пользователя SMTP",
        "description": "Ваш Email или логин",
        "placeholder": "user@example.com"
      },
      "email_password": {
        "title": "Пароль SMTP",
        "description": "Пароль приложения или основной пароль",
        "placeholder": "Введите пароль"
      },
      "email_encryption": {
        "title": "Шифрование",
        "description": "Способ защиты соединения",
        "placeholder": "Выберите шифрование",
        "none": "Нет",
        "ssl": "SSL/TLS",
        "tls": "STARTTLS"
      },
      "email_from_address": {
        "title": "Email отправителя",
        "description": "Будет отображаться в заголовке письма",
        "placeholder": "noreply@example.com"
      },
      "email_from_name": {
        "title": "Имя отправителя",
        "description": "Напр. 'Администрация Fboard'"
      },
      "email_template": {
        "title": "Шаблон письма",
        "description": "Выберите стиль оформления уведомлений",
        "placeholder": "Выберите шаблон"
      },
      "remind_mail_enable": {
        "title": "Email напоминания",
        "description": "Уведомлять пользователей об окончании трафика или срока действия."
      },
      "test": {
        "title": "Тестовое письмо",
        "sending": "Отправка...",
        "description": "Проверить настройки, отправив письмо себе",
        "success": "Письмо успешно отправлено",
        "error": "Ошибка при отправке теста",
        "label_to": "Кому",
        "label_subject": "Тема",
        "placeholder_to": "user@example.com",
        "placeholder_subject": "Тема тестового письма"
      }
    },
    "telegram": {
      "title": "Настройки Telegram",
      "description": "Связь с Telegram ботом: уведомления, привязка аккаунтов и команды.",
      "bot_token": {
        "title": "Токен бота",
        "description": "Получите у @BotFather.",
        "placeholder": "0000000000:xxxxxxxxx_xxxxxxxxxxxxxxx"
      },
      "webhook_url": {
        "title": "Webhook Base URL",
        "description": "Оставьте пустым для URL сайта. Система сама добавит нужные пути.",
        "docs": "Документация Telegram Webhook",
        "placeholder": "https://example.com"
      },
      "webhook": {
        "title": "Установить Webhook",
        "description": "Без этой настройки бот не будет получать сообщения от пользователей.",
        "button": "Настройка в 1 клик",
        "setting": "Настройка...",
        "success": "Webhook установлен успешно",
        "error": "Не удалось установить Webhook",
        "target_default": "Используется основной URL сайта.",
        "target_custom": "Используется кастомный URL: {{url}}",
        "debug": {
          "title": "Отладка Webhook",
          "success": "Успех",
          "url": "Полный URL",
          "baseUrl": "Base URL"
        }
      },
      "bot_enable": {
        "title": "Гайд по привязке",
        "description": "Показывать инструкцию по подключению Telegram на стороне пользователя."
      },
      "discuss_link": {
        "title": "Ссылка на группу/чат",
        "description": "Будет отображаться в личном кабинете.",
        "placeholder": "https://t.me/your_chat"
      }
    },
    "app": {
      "title": "Настройки приложений",
      "description": "Конфигурация ссылок на скачивание и версий клиентов для различных платформ.",
      "common": {
        "placeholder": "Введите значение"
      },
      "windows": {
        "version": {
          "title": "Версия Windows",
          "description": "Текущая версия клиента для Windows"
        },
        "download": {
          "title": "Ссылка скачивания Windows",
          "description": "URL для загрузки .exe файла"
        }
      },
      "macos": {
        "version": {
          "title": "Версия macOS",
          "description": "Текущая версия клиента для macOS"
        },
        "download": {
          "title": "Ссылка скачивания macOS",
          "description": "URL для загрузки .dmg файла"
        }
      },
      "android": {
        "version": {
          "title": "Версия Android",
          "description": "Текущая версия .apk"
        },
        "download": {
          "title": "Ссылка скачивания Android",
          "description": "URL для загрузки APK"
        }
      }
    },
    "common": {
      "saving": "Сохранение...",
      "save": "Сохранить",
      "save_success": "Сохранено",
      "save_error": "Ошибка сохранения",
      "reset": "Сбросить",
      "placeholder": "Текст...",
      "autoSaved": "Автосохранено",
      "saved_at": "Сохранено {{seconds}} сек. назад",
      "invalidJson": "Некорректный JSON"
    },
    "subscribe_template": {
      "title": "Шаблоны подписки",
      "description": "Конфигурация форматов выдачи для различных клиентов (загрузка по запросу, сохранение вручную).",
      "unsaved_hint": "Есть несохранённые изменения. Нажмите «Сохранить».",
      "singbox": {
        "title": "Шаблон Sing-box",
        "description": "Формат конфига для Sing-box"
      },
      "clash": {
        "title": "Шаблон Clash",
        "description": "Формат конфига для Clash"
      },
      "clashmeta": {
        "title": "Шаблон Clash Meta",
        "description": "Формат конфига для Clash Meta (Mihomo)"
      },
      "stash": {
        "title": "Шаблон Stash",
        "description": "Формат конфига для Stash (iOS)"
      },
      "surge": {
        "title": "Шаблон Surge",
        "description": "Формат конфига для Surge"
      },
      "surfboard": {
        "title": "Шаблон Surfboard",
        "description": "Формат конфига для Surfboard"
      }
    },
    "email_template": {
      "title": "Шаблоны писем",
      "description": "Настройка шаблонов системных email-уведомлений",
      "customized": "Изменен",
      "subject": "Тема",
      "subject_placeholder": "Введите тему письма, поддерживаются {{name}} и другие переменные",
      "content": "Содержимое шаблона (HTML)",
      "preview": "Предварительный просмотр",
      "override_hint": "Сохранение переопределит системный шаблон по умолчанию. Нажмите «По умолчанию», чтобы восстановить шаблон темы.",
      "placeholders": "Доступные переменные",
      "var_name": "Переменная",
      "var_desc": "Описание",
      "var_sample": "Пример",
      "required": "Обяз.",
      "insert": "Вставить",
      "placeholder_hint": "* обязательные переменные. Нажмите для вставки в конец содержимого.",
      "click_to_insert": "Нажмите для вставки",
      "save": "Сохранить",
      "save_success": "Шаблон сохранён",
      "save_before_test": "Сохраните изменения перед отправкой тестового письма",
      "send_test": "Тестовое письмо",
      "test_dialog_title": "Отправить тестовое письмо",
      "test_dialog_description": "Введите email получателя. Оставьте пустым для отправки на ваш admin email.",
      "test_email_placeholder": "Email получателя (пусто = текущий аккаунт)",
      "sending": "Отправка...",
      "test_success": "Тестовое письмо отправлено",
      "reset": "По умолчанию",
      "reset_title": "Сброс шаблона",
      "reset_description": "Вы уверены, что хотите сбросить шаблон? Ваши изменения будут удалены.",
      "reset_confirm": "Подтвердить",
      "reset_success": "Шаблон сброшен",
      "unsaved": "Есть несохранённые изменения",
      "discard_title": "Несохранённые изменения",
      "discard_description": "В этом шаблоне есть несохранённые изменения. При переключении вкладки они будут потеряны.",
      "discard_confirm": "Отменить изменения",
      "cancel": "Отмена"
    }
  },
  "notice": {
    "title": "Управление объявлениями",
    "description": "Здесь вы можете настраивать объявления, включая добавление, удаление, редактирование и другие операции.",
    "table": {
      "columns": {
        "id": "ID",
        "show": "Статус показа",
        "title": "Заголовок",
        "actions": "Действия"
      },
      "toolbar": {
        "search": "Поиск по заголовку...",
        "reset": "Сброс",
        "sort": {
          "edit": "Изменить порядок",
          "save": "Сохранить порядок"
        }
      },
      "actions": {
        "edit": "Изменить",
        "delete": {
          "title": "Подтверждение удаления",
          "description": "Вы уверены, что хотите удалить это объявление? Это действие нельзя отменить.",
          "success": "Успешно удалено"
        }
      }
    },
    "form": {
      "add": {
        "title": "Добавить объявление",
        "button": "Добавить объявление"
      },
      "edit": {
        "title": "Изменить объявление"
      },
      "fields": {
        "title": {
          "label": "Заголовок",
          "placeholder": "Введите заголовок объявления"
        },
        "content": {
          "label": "Содержимое"
        },
        "img_url": {
          "label": "Фоновое изображение",
          "placeholder": "Введите URL фонового изображения"
        },
        "show": {
          "label": "Показывать"
        },
        "tags": {
          "label": "Теги",
          "placeholder": "Нажмите Enter для добавления тегов"
        }
      },
      "buttons": {
        "cancel": "Отмена",
        "submit": "Отправить",
        "success": "Успешно отправлено"
      }
    },
    "messages": {
      "loadError": "Не удалось загрузить объявления"
    }
  },
  "group": {
    "title": "Группы прав",
    "description": "Управление всеми группами прав, включая добавление, удаление и редактирование.",
    "columns": {
      "id": "ID группы",
      "name": "Название группы",
      "usersCount": "Пользователей",
      "serverCount": "Узлов",
      "actions": "Действия"
    },
    "form": {
      "add": "Добавить группу",
      "edit": "Изменить группу",
      "create": "Создать группу",
      "update": "Обновить",
      "name": "Название группы",
      "namePlaceholder": "Введите название группы",
      "nameDescription": "Название группы используется для идентификации. Рекомендуется использовать понятные имена.",
      "cancel": "Отмена",
      "editDescription": "Изменение информации о группе. Изменения вступят в силу немедленно.",
      "createDescription": "Создайте новую группу прав для разграничения доступа пользователей."
    },
    "toolbar": {
      "searchPlaceholder": "Поиск групп...",
      "reset": "Сбросить"
    },
    "messages": {
      "deleteConfirm": "Подтверждение удаления",
      "deleteDescription": "Это действие навсегда удалит эту группу прав. Продолжить?",
      "deleteButton": "Удалить",
      "createSuccess": "Создано успешно",
      "updateSuccess": "Обновлено успешно",
      "nameValidation": {
        "min": "Название должно содержать минимум 2 символа",
        "max": "Название не может превышать 50 символов",
        "pattern": "Название может содержать только буквы, цифры, китайские иероглифы, подчеркивания и дефисы"
      }
    }
  },
  "auth": {
    "signIn": {
      "title": "Вход",
      "description": "Введите свой email и пароль для входа",
      "email": "Email",
      "emailPlaceholder": "name@example.com",
      "password": "Пароль",
      "passwordPlaceholder": "Введите ваш пароль",
      "forgotPassword": "Забыли пароль?",
      "submit": "Войти",
      "rememberMe": "Запомнить меня",
      "resetPassword": {
        "title": "Сброс пароля",
        "description": "Выполните следующую команду в директории сайта, чтобы сбросить пароль",
        "command": "php artisan reset:password admin-email"
      },
      "validation": {
        "emailRequired": "Пожалуйста, введите адрес электронной почты",
        "emailInvalid": "Пожалуйста, введите корректный адрес электронной почты",
        "passwordRequired": "Пожалуйста, введите пароль",
        "passwordLength": "Пароль должен содержать не менее 7 символов"
      }
    }
  },
  "traffic": {
    "trafficRecord": {
      "title": "Записи использования трафика",
      "time": "Время",
      "upload": "Отдача",
      "download": "Загрузка",
      "rate": "Множитель",
      "total": "Всего",
      "noRecords": "Записей не найдено",
      "perPage": "Показывать по",
      "records": "записей",
      "page": "Страница {{current}} / {{total}}",
      "multiplier": "{{value}}x"
    }
  },
  "payment": {
    "title": "Способы оплаты",
    "description": "Настройка способов оплаты, включая Alipay, WeChat Pay и др.",
    "table": {
      "columns": {
        "id": "ID",
        "enable": "Включено",
        "name": "Название",
        "payment": "Шлюз",
        "notify_url": "URL уведомления",
        "notify_url_tooltip": "Шлюз будет отправлять уведомления на этот адрес. Убедитесь, что он доступен через ваш брандмауэр.",
        "actions": "Действия"
      },
      "actions": {
        "edit": "Изменить",
        "copy": "Копировать",
        "copy_success": "Успешно скопировано",
        "delete": {
          "title": "Подтверждение удаления",
          "description": "Вы уверены, что хотите удалить этот способ оплаты? Это действие нельзя отменить.",
          "success": "Успешно удалено"
        }
      },
      "toolbar": {
        "search": "Поиск способов оплаты...",
        "reset": "Сбросить",
        "sort": {
          "hint": "Перетаскивайте для сортировки, затем нажмите сохранить",
          "save": "Сохранить порядок",
          "edit": "Изменить порядок"
        }
      }
    },
    "form": {
      "add": {
        "button": "Добавить способ оплаты",
        "title": "Добавить способ оплаты"
      },
      "edit": {
        "title": "Изменить способ оплаты"
      },
      "fields": {
        "name": {
          "label": "Отображаемое название",
          "placeholder": "Введите название",
          "description": "Используется для отображения пользователям"
        },
        "icon": {
          "label": "URL иконки",
          "placeholder": "https://example.com/icon.svg",
          "description": "URL иконки для отображения"
        },
        "notify_domain": {
          "label": "Домен уведомлений",
          "placeholder": "https://example.com",
          "description": "Домен для получения уведомлений от шлюза"
        },
        "handling_fee_percent": {
          "label": "Комиссия (%)",
          "placeholder": "0-100"
        },
        "handling_fee_fixed": {
          "label": "Фиксированная комиссия",
          "placeholder": "0"
        },
        "payment": {
          "label": "Платежный шлюз",
          "placeholder": "Выберите шлюз",
          "description": "Выберите технический шлюз для обработки оплаты"
        }
      },
      "validation": {
        "name": {
          "min": "Название должно содержать минимум 2 символа",
          "max": "Название не может превышать 30 символов"
        },
        "notify_domain": {
          "url": "Пожалуйста, введите корректный URL"
        },
        "payment": {
          "required": "Пожалуйста, выберите платежный шлюз"
        }
      },
      "buttons": {
        "cancel": "Отмена",
        "submit": "Отправить"
      },
      "sections": {
        "payment_config": "Конфигурация шлюза"
      },
      "messages": {
        "success": "Успешно сохранено"
      },
      "config": {
        "title": "Конфигурация оплаты",
        "noConfig": "Нет настроек для этого способа оплаты"
      }
    }
  },
  "server": {
    "title": "Конфигурация узлов",
    "description": "Настройка связи и синхронизации узлов: ключ, интервалы опроса, балансировка и другие параметры.",
    "server_token": {
      "title": "Ключ связи",
      "description": "Ключ связи между панелью и узлами для защиты данных.",
      "placeholder": "Введите ключ связи"
    },
    "server_pull_interval": {
      "title": "Интервал опроса (pull)",
      "description": "Частота получения данных узлом с панели.",
      "placeholder": "Введите интервал получения"
    },
    "server_push_interval": {
      "title": "Интервал опроса (push)",
      "description": "Частота отправки данных узлом на панель.",
      "placeholder": "Введите интервал отправки"
    },
    "device_limit_mode": {
      "title": "Режим ограничения устройств",
      "description": "В мягком режиме несколько узлов с одного IP считаются одним устройством.",
      "strict": "Строгий режим",
      "relaxed": "Мягкий режим",
      "placeholder": "Выберите режим ограничения устройств"
    },
    "saving": "Сохранение...",
    "manage": {
      "title": "Управление узлами",
      "description": "Управление всеми узлами, включая добавление, удаление, редактирование и другие операции.",
      "filtered_by_server": "Сейчас показаны узлы сервера {{server}} (SID:{{id}})",
      "filtered_by_server_description": "Новые узлы здесь можно сразу привязать к текущему серверу.",
      "add_node_to_server": "Добавить узел на этот сервер",
      "clear_server_filter": "Сбросить фильтр сервера"
    },
    "columns": {
      "sort": "Сортировка",
      "nodeId": "ID узла",
      "show": "Показ",
      "node": "Узел",
      "address": "Адрес",
      "onlineUsers": {
        "title": "Пользователи онлайн",
        "tooltip": "Количество пользователей онлайн на основе частоты отчетов сервера"
      },
      "rate": {
        "title": "Множитель",
        "tooltip": "Множитель тарификации трафика"
      },
      "traffic": {
        "title": "Трафик",
        "tooltip": "Использование трафика узлом",
        "total": "Всего",
        "used": "Использовано",
        "percentage": "Использование"
      },
      "groups": {
        "title": "Группы доступа",
        "tooltip": "Группы, которые могут подписаться на этот узел",
        "empty": "--"
      },
      "loadStatus": {
        "title": "Загрузка",
        "tooltip": "Использование ресурсов сервера",
        "noData": "Нет данных",
        "details": "Детали загрузки системы",
        "cpu": "Загрузка CPU",
        "memory": "Память",
        "swap": "Swap",
        "disk": "Диск",
        "lastUpdate": "Последнее обновление",
        "metrics": {
          "title": "Метрики",
          "uptime": "Аптайм",
          "conns": "Соединения",
          "speed": "Скорость",
          "api": "Статус API",
          "gc": "Пауза GC",
          "goroutines": "Горутины",
          "kernel": "Статус ядра",
          "limit": "Пользователи с лимитом",
          "load": "Нагрузка системы",
          "users": "Пользователи онлайн",
          "ws": "WebSocket"
        }
      },
      "customId": "Кастомный ID",
      "originalId": "Оригинальный ID",
      "type": "Тип",
      "actions": "Действия",
      "copyAddress": "Копировать адрес",
      "internalPort": "Внутр. порт",
      "deployment": {
        "title": "Развёртывание",
        "tooltip": "Показывает, работает ли узел автономно или размещён на сервере, и позволяет менять это прямо в списке.",
        "standalone": "Автономно",
        "standalone_row_hint": "Без привязки к серверу",
        "standalone_description": "Этот узел работает независимо и не требует серверного хостинга.",
        "online": "Онлайн",
        "offline": "Офлайн",
        "inactive": "Сервер неактивен",
        "disabled": "Узел выключен",
        "enabled": "Включить на сервере",
        "enabled_description": "Только включённые узлы будут запускаться и синхронизироваться выбранным сервером.",
        "enabled_standalone_description": "Для автономных узлов серверное состояние включения не требуется.",
        "bind_success": "Размещено на {{server}}",
        "standalone_success": "Переключено в автономное развёртывание",
        "update_success": "Развёртывание обновлено",
        "update_error": "Не удалось обновить развёртывание"
      },
      "status": {
        "0": "Не запущен",
        "1": "Не используется или ошибка",
        "2": "Работает нормально"
      },
      "childNode": "Дочерний узел",
      "actions_dropdown": {
        "edit": "Редактировать",
        "copy": "Копировать",
        "delete": {
          "title": "Подтверждение удаления",
          "description": "Это действие навсегда удалит этот узел и не может быть отменено. Вы уверены, что хотите продолжить?",
          "confirm": "Удалить"
        },
        "copy_success": "Скопировано успешно",
        "delete_success": "Удалено успешно",
        "reset_traffic": {
          "confirm": "Сбросить трафик",
          "description": "Это обнулит upload/download трафик узла и снимет блокировку. Продолжить?",
          "title": "Подтверждение сброса трафика"
        },
        "reset_traffic_success": "Трафик сброшен"
      },
      "version": "Версия"
    },
    "toolbar": {
      "search": "Поиск узлов...",
      "type": "Тип",
      "status": "Статус",
      "server": "Сервер",
      "server_search": "Поиск серверов...",
      "server_empty": "Серверы не найдены",
      "reset": "Сброс",
      "actions": "Действия",
      "sort": {
        "tip": "Перетаскивайте узлы для сортировки, затем нажмите сохранить",
        "edit": "Редактировать порядок",
        "save": "Сохранить порядок",
        "success": "Порядок сортировки сохранён"
      },
      "batch_delete": {
        "menu": "Удалить узлы",
        "button": "Удалить {{count}} шт.",
        "title": "Подтверждение удаления",
        "description": "Вы уверены, что хотите удалить {{count}} узлов? Это действие необратимо.",
        "confirm": "Подтвердить удаление"
      },
      "batch_delete_success": "Успешно удалено {{count}} узлов",
      "batch_delete_error": "Ошибка пакетного удаления",
      "batch_show": {
        "menu": "Показать узлы"
      },
      "batch_show_success": "Успешно показано {{count}} узлов",
      "batch_show_error": "Ошибка пакетного показа",
      "batch_hide": {
        "menu": "Скрыть узлы"
      },
      "batch_hide_success": "Успешно скрыто {{count}} узлов",
      "batch_hide_error": "Ошибка пакетного скрытия",
      "batch_enable": {
        "menu": "Включить узлы"
      },
      "batch_enable_success": "Успешно включено {{count}} узлов",
      "batch_enable_error": "Ошибка пакетного включения",
      "batch_disable": {
        "menu": "Отключить узлы"
      },
      "batch_disable_success": "Успешно отключено {{count}} узлов",
      "batch_disable_error": "Ошибка пакетного отключения",
      "batch_reset_traffic": {
        "menu": "Сбросить трафик",
        "button": "Сбросить {{count}} шт.",
        "title": "Подтверждение сброса трафика",
        "description": "Вы уверены, что хотите сбросить трафик {{count}} узлов? Это обнулит трафик и снимет блокировки.",
        "confirm": "Подтвердить сброс"
      },
      "batch_reset_traffic_success": "Успешно сброшен трафик {{count}} узлов",
      "batch_reset_traffic_error": "Ошибка пакетного сброса трафика",
      "batch_replace": {
        "selected": "Выбрано узлов: {{count}}",
        "menu": "Пакетная замена",
        "clear": "Снять выбор",
        "title": "Пакетная замена поля узла",
        "field": "Поле",
        "search": "Искомое значение",
        "search_placeholder": "Введите искомую строку",
        "replace": "Значение замены",
        "replace_placeholder": "Введите строку для замены",
        "confirm": "Заменить",
        "search_required": "Введите искомое значение",
        "success": "Успешно заменено узлов: {{count}}",
        "fields": {
          "name": "Имя узла",
          "host": "Хост",
          "port": "Порт",
          "code": "Код узла",
          "group_ids": "Группы",
          "route_ids": "Маршруты",
          "tags": "Теги",
          "protocol_settings": "Настройки протокола",
          "custom_outbounds": "Свои исходящие",
          "custom_routes": "Свои маршруты",
          "cert_config": "Настройки сертификата",
          "rate_time_ranges": "Периоды множителя"
        }
      },
      "filteringByMachine": "Фильтр узлов этой машины:",
      "virtualNode": "Виртуальный узел"
    },
    "form": {
      "add_node": "Добавить узел",
      "edit_node": "Изменить узел",
      "new_node": "Новый узел",
      "type": {
        "placeholder": "Выберите тип протокола",
        "select_prompt": "Сначала выберите тип протокола",
        "select_error": "Пожалуйста, выберите тип протокола",
        "configHint": "После выбора протокола можно настроить параметры"
      },
      "name": {
        "label": "Название узла",
        "placeholder": "Пожалуйста, введите название узла",
        "error": "Пожалуйста, введите корректное название"
      },
      "rate": {
        "label": "Базовый множитель",
        "hint": "Множитель учёта трафика; 1 — по фактическому объёму",
        "error": "Множитель обязателен",
        "error_numeric": "Множитель должен быть числом",
        "error_gte_zero": "Множитель должен быть больше или равен 0",
        "child_node_tooltip": "Множитель дочернего узла наследуется от родительского и не может быть изменен отдельно",
        "child_node_note": "Множитель наследуется от родителя"
      },
      "dynamic_rate": {
        "section_title": "Конфигурация динамического множителя",
        "enable_label": "Включить дин. множитель",
        "enable_description": "Установите разные множители в зависимости от времени суток",
        "rules_label": "Правила периодов",
        "add_rule": "Добавить правило",
        "rule_title": "Правило {{index}}",
        "start_time": "Время начала",
        "end_time": "Время окончания",
        "multiplier": "Множитель",
        "no_rules": "Правил пока нет, нажмите кнопку выше, чтобы добавить",
        "start_time_error": "Время начала обязательно",
        "end_time_error": "Время окончания обязательно",
        "multiplier_error": "Множитель обязателен",
        "multiplier_error_numeric": "Множитель должен быть числом",
        "multiplier_error_gte_zero": "Множитель должен быть больше или равен 0"
      },
      "required_mark": "Обязательно",
      "optional_mark": "Необязательно",
      "required_fields_hint": "Поля, отмеченные *, обязательны",
      "code": {
        "label": "Кастомный ID узла",
        "optional": "(Опционально)",
        "placeholder": "Введите кастомный ID узла",
        "hint": "Необязательно; для внешней сверки, на соединение не влияет"
      },
      "tags": {
        "label": "Теги узла",
        "optional": "(Опционально)",
        "placeholder": "Нажмите Enter для добавления",
        "hint": "Необязательно; отображаются рядом с именем узла у пользователей"
      },
      "groups": {
        "label": "Группы доступа",
        "add": "Добавить группу",
        "placeholder": "Пожалуйста, выберите группы",
        "empty": "Ничего не найдено",
        "hint": "Необязательно; определяет, какие группы пользователей видят узел"
      },
      "machine": {
        "label": "Привязка к серверу",
        "placeholder": "Выберите сервер (необязательно)",
        "none": "Автономная",
        "enabled_hint": "Управлять ли этим узлом с сервера",
        "hint": "Необязательно; привязка передаёт узел Fboard-Node на этом сервере"
      },
      "host": {
        "label": "Адрес узла",
        "placeholder": "Введите домен или IP",
        "error": "Адрес узла обязателен"
      },
      "port": {
        "label": "Порт подключения",
        "placeholder": "443 или 10000-11000",
        "tooltip": "Порт подключения клиента. Поддерживается один порт (например 443) или диапазон (например 10000-11000). Для Hysteria2 диапазон означает прослушивание всех портов (максимальный размах 1024) для UDP port hopping; для других протоколов диапазон используется только для случайного выбора порта в подписке. При использовании транзита/туннеля может отличаться от порта сервера.",
        "sync": "Синхронизировать с портом сервера",
        "error": "Порт подключения обязателен"
      },
      "server_port": {
        "label": "Порт сервера",
        "placeholder": "Введите порт сервера",
        "error": "Порт сервера обязателен",
        "tooltip": "Фактический порт прослушивания на сервере. Для Hysteria2 с диапазоном портов подключения узел слушает весь диапазон; это поле — запасной одиночный порт.",
        "sync": "Синхронизировать с портом сервера"
      },
      "parent": {
        "label": "Родительский узел",
        "placeholder": "Выберите родителя",
        "none": "Нет",
        "hint": "Необязательно; дочерний узел наследует протокол и онлайн-статус"
      },
      "route": {
        "label": "Группы маршрутов",
        "placeholder": "Выберите маршруты",
        "empty": "Ничего не найдено"
      },
      "submit": "Отправить",
      "cancel": "Отмена",
      "success": "Успешно отправлено",
      "listen_address": {
        "description": "IP-адрес прослушивания. Оставьте пустым для значения по умолчанию (0.0.0.0). Можно указать 127.0.0.1 или конкретный IP.",
        "hide": "Скрыть адрес прослушивания",
        "label": "Адрес прослушивания",
        "optional": "Необязательно",
        "placeholder": "Оставьте пустым (0.0.0.0) или введите, например, 127.0.0.1, ::1",
        "show": "Адрес прослушивания"
      },
      "banned": {
        "description": "Отключённый узел будет недоступен",
        "label": "Отключить узел"
      },
      "traffic_limit": {
        "error_gte_zero": "Лимит трафика должен быть ≥ 0",
        "error_numeric": "Лимит трафика должен быть числом",
        "hint": "Верхний предел трафика узла (ГБ), 0 = без лимита",
        "label": "Лимит трафика",
        "placeholder": "0 = без лимита"
      },      "protocolSection": "Настройки протокола",
      "traffic_limit_unit": "ГБ, 0=без лимита",

      "virtualNode": {
        "add": "Добавить виртуальный узел",
        "addDialogTitle": "Добавление виртуального узла",
        "delete": "Удалить",
        "deleteConfirmDesc": "Удалить виртуальный узел «{{name}}»? Это действие необратимо.",
        "deleteConfirmTitle": "Подтверждение удаления",
        "deleteFailed": "Не удалось удалить",
        "deleteSuccess": "Виртуальный узел удалён",
        "description": "Виртуальный узел — дополнительная точка доступа того же сервиса",
        "edit": "Редактировать",
        "editDialogTitle": "Редактирование виртуального узла",
        "empty": "Нет виртуальных узлов",
        "generateKeyPair": "Сгенерировать ключевую пару",
        "groupIds": "Группы доступа",
        "groupIdsHint": "Можно выбрать только группы родительского узла; лишние группы не смогут подключаться",
        "groupIdsParentEmpty": "Сначала назначьте группы доступа родительскому узлу",
        "hidden": "Скрыт",
        "host": "Хост",
        "hostPlaceholder": "хост / домен",
        "label": "Виртуальный узел",
        "namePlaceholder": "Имя виртуального узла",
        "port": "Порт",
        "save": "Сохранить виртуальный узел",
        "saveFailed": "Не удалось сохранить виртуальный узел",
        "saveSuccess": "Виртуальный узел сохранён",
        "show": "Показать",
        "tags": "Теги",
        "tagsPlaceholder": "Введите и нажмите Enter",
        "toggleFailed": "Не удалось обновить видимость",
        "visible": "Видимый"
      }
    },
    "networkTemplate": {
      "title": "Сетевые шаблоны",
      "empty": "Для этого протокола нет доступных шаблонов",
      "description": "Выберите предустановленный сетевой шаблон, чтобы заполнить настройки протокола",
      "use": "Применить"
    ,
      "presets": {
        "vless-tcp-vision": {
          "label": "TCP + XTLS Vision",
          "description": "VLESS + TCP + XTLS Vision напрямую; очень быстро, рекомендуется"
        },
        "vless-ws-tls": {
          "label": "WebSocket + TLS + CDN",
          "description": "VLESS + WebSocket + TLS; совместим с CDN (Cloudflare и др.)"
        },
        "vless-grpc-tls": {
          "label": "gRPC + TLS",
          "description": "VLESS + gRPC + TLS; подходит для высокой нагрузки"
        },
        "vless-tcp-reality": {
          "label": "TCP + REALITY",
          "description": "VLESS + REALITY напрямую; без сертификата, устойчивость к probing"
        },
        "trojan-tls": {
          "label": "Trojan + TLS",
          "description": "Стандартный Trojan + TLS, порт 443"
        },
        "trojan-ws-tls": {
          "label": "Trojan + WebSocket + TLS",
          "description": "Trojan + WebSocket + TLS; совместим с CDN"
        },
        "ss-simple": {
          "label": "Стандартный AEAD",
          "description": "Туннель Shadowsocks; просто и эффективно"
        },
        "hy-standard": {
          "label": "Hysteria стандарт",
          "description": "Hysteria на QUIC; устойчив к потерям, для слабых сетей"
        },
        "hy-brutal": {
          "label": "Hysteria2 Brute",
          "description": "Hysteria2 + режим Brute; максимальное использование канала"
        },
        "tuic-v5": {
          "label": "TUIC v5 стандарт",
          "description": "TUIC v5 на QUIC; низкая задержка"
        },
        "anytls-default": {
          "label": "AnyTLS по умолчанию",
          "description": "AnyTLS с автоматической TLS-маскировкой"
        },
        "sudoku-default": {
          "label": "Sudoku по умолчанию",
          "description": "Низкоэнтропийная таблица + ChaCha20 + legacy HTTPMask"
        },
        "shadowquic-default": {
          "label": "ShadowQUIC по умолчанию",
          "description": "JLS-маскировка + 0-RTT QUIC, upstream Cloudflare по умолчанию"
        }
      }},
    "dynamic_form": {
      "utls": {
        "fingerprint": {
          "random": "Случайный (при подписке)",
          "randomized": "Рандомизированный (на клиенте)"
        }
      },
      "multiplex": {
        "enabled": {
          "label": "Multiplex",
          "description": "Передача нескольких потоков через одно TCP-соединение"
        },
        "protocol": {
          "label": "Протокол"
        },
        "max_connections": {
          "label": "Макс. соединений"
        },
        "min_streams": {
          "label": "Мин. потоков"
        },
        "padding": {
          "label": "Включить Padding"
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
          "description": "TCP Brutal — двусторонний алгоритм ускорения. Установите пропускную способность 80%-90% от реальной. BBR будет отключён при включении."
        }
      },
      "ech": {
        "description": "Включает Encrypted Client Hello для поддерживаемых TLS-клиентов. Если конфигурация пуста, будет выполнен DNS-запрос.",
        "generate": "Авто-генерация ECH ключей",
        "generateSuccess": "Пара ключей ECH создана",
        "generateFailed": "Не удалось сгенерировать ключи ECH",
        "config": {
          "label": "ECH Config (PEM)",
          "placeholder": "Вставьте конфигурацию ECH в формате PEM, по одной строке на строку",
          "description": "Если пусто, sing-box попробует загрузить конфигурацию ECH из DNS."
        },
        "config_path": {
          "label": "Путь к конфигу ECH",
          "placeholder": "/etc/sing-box/ech.pem",
          "description": "Путь к файлу конфигурации ECH в формате PEM."
        },
        "query_server_name": {
          "label": "Имя сервера для запроса ECH",
          "placeholder": "Необязательная замена домена для HTTPS-запроса",
          "description": "Переопределяет домен для ECH HTTPS-запросов. По умолчанию используется server_name."
        },
        "key": {
          "label": "ECH Key",
          "placeholder": "Вставьте содержимое ECH key, если это требуется бэкенду",
          "description": "Необязательное содержимое ECH key для бэкенда."
        },
        "key_path": {
          "label": "Путь к ECH key",
          "placeholder": "/etc/sing-box/ech.key",
          "description": "Путь к файлу ECH key, если это требуется бэкенду."
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
            "label": "Public Key content",
            "description": "Вставьте полный PEM сертификата, не путь к файлу",
            "placeholder": "-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"
          },
          "key_content": {
            "label": "Private Key content",
            "description": "Вставьте полный PEM приватного ключа, не путь к файлу",
            "placeholder": "-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"
          },
          "templates": {
            "title": "Шаблоны сертификатов",
            "save_current": "Сохранить текущее как шаблон",
            "save": "Сохранить шаблон",
            "saved": "Шаблон сертификата сохранён",
            "save_failed": "Не удалось сохранить шаблон сертификата",
            "deleted": "Шаблон сертификата удалён",
            "delete_failed": "Не удалось удалить шаблон сертификата",
            "delete": "Удалить шаблон",
            "use": "Применить",
            "applied": "Применён шаблон сертификата: {{name}}",
            "name_required": "Введите имя шаблона",
            "name_placeholder": "Имя шаблона, например: production cert",
            "description_placeholder": "Описание шаблона (необязательно)",
            "search_placeholder": "Поиск шаблонов по имени или описанию…",
            "empty_content": "Сначала заполните содержимое сертификата и ключа, затем сохраните как шаблон",
            "empty": "Шаблонов сертификатов пока нет"
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
          "server_description": "Параметр decryption на сервере; сгенерируйте через ./xray vlessenc",
          "client_label": "encryption",
          "client_placeholder": "./xray vlessenc",
          "client_description": "Параметр encryption на клиенте; должен соответствовать серверу",
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
        "keyPairTitle": "Пара ключей Sudoku",
        "keyPairDescription": "Сервер использует Master Public Key; Master Private Key хранится только в панели для генерации ключей пользователей и не передаётся на узлы",
        "generate": "Сгенерировать",
        "generateSuccess": "Пара ключей Sudoku создана",
        "generateFailed": "Не удалось сгенерировать ключи Sudoku",
        "publicPlaceholder": "Нажмите «Сгенерировать» выше, чтобы заполнить",
        "privatePlaceholder": "Только в панели — не раскрывайте",
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
      "advanced": {
        "trigger_label": "Расширенная конфигурация",
        "dialog_title": "Расширенная конфигурация протокола",
        "tls_tab": "TLS",
        "route_tab": "Маршрутизация",
        "multiplex_tab": "Мультиплексирование"
      },
      "cert_config": {
        "cert_content": {
          "description": "Вставьте полный PEM сертификата, не путь к файлу",
          "label": "Содержимое сертификата (PEM)",
          "placeholder": "-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"
        },
        "cert_mode": {
          "description": "Способ получения сертификата (зависит от бэкенда узла)",
          "label": "Режим сертификата",
          "none_desc": "TLS-сертификат не настроен"
        },
        "dns_env": {
          "description_short": "По одному KEY=VALUE в строке",
          "label": "Переменные окружения (API-ключи)"
        },
        "dns_provider": {
          "doc_link": "Руководство по DNS-провайдерам",
          "label": "DNS-провайдер"
        },
        "domain": {
          "label": "Домен сертификата"
        },
        "email": {
          "label": "Email уведомлений"
        },
        "http_port": {
          "description": "Порт ACME challenge (по умолчанию 80)",
          "label": "Порт challenge"
        },
        "key_content": {
          "description": "Вставьте полный PEM приватного ключа, не путь к файлу",
          "label": "Приватный ключ (PEM)",
          "placeholder": "-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"
        },
        "none_desc": "TLS-сертификат не настроен",
        "tab": "TLS-сертификат",
        "templates": {
          "title": "Шаблоны сертификатов",
          "save_current": "Сохранить текущее как шаблон",
          "save": "Сохранить шаблон",
          "saved": "Шаблон сертификата сохранён",
          "save_failed": "Не удалось сохранить шаблон сертификата",
          "deleted": "Шаблон сертификата удалён",
          "delete_failed": "Не удалось удалить шаблон сертификата",
          "delete": "Удалить шаблон",
          "use": "Применить",
          "applied": "Применён шаблон сертификата: {{name}}",
          "name_required": "Введите имя шаблона",
          "name_placeholder": "Имя шаблона, например: production cert",
          "description_placeholder": "Описание шаблона (необязательно)",
          "search_placeholder": "Поиск шаблонов по имени или описанию…",
          "empty_content": "Сначала заполните содержимое сертификата и ключа, затем сохраните как шаблон",
          "empty": "Шаблонов сертификатов пока нет"
        }
      },
      "routing": {
        "error": {
          "invalid_json": "Некорректный JSON",
          "must_be_array": "Должен быть JSON-массив []"
        },
        "outbounds": "Пользовательские Outbounds (JSON)",
        "outbounds_tab": "Outbounds",
        "routes": "Пользовательские Routes (JSON)",
        "routes_tab": "Routes"
      }
    },
    "network_settings": {
      "edit_protocol": "Edit Protocol",
      "edit_protocol_config": "Edit Protocol Configuration",
      "use_template": "Use {{template}} Template",
      "json_config_placeholder": "Please enter JSON configuration",
      "json_config_placeholder_with_template": "Please enter JSON configuration or select template above",
      "validation": {
        "must_be_object": "Configuration must be a JSON object",
        "invalid_json": "Invalid JSON format",
        "must_be_array": "Конфигурация должна быть JSON-массивом"
      },
      "errors": {
        "save_failed": "Error occurred while saving"
      },
      "edit_padding_scheme": "Редактировать схему padding",
      "builtin": "Встроенный",
      "delete_template": "Удалить шаблон",
      "json_label": "Сетевые настройки (JSON)",
      "save_as_template": "Сохранить как шаблон",
      "save_template": "Сохранить шаблон",
      "template_applied": "Применён шаблон: {{name}}",
      "template_custom_desc": "Пользовательский шаблон сетевых настроек",
      "template_delete_failed": "Не удалось удалить шаблон",
      "template_deleted": "Шаблон удалён",
      "template_empty": "Конфигурация пуста, нельзя сохранить как шаблон",
      "template_from_current": "Из текущей конфигурации {{network}}",
      "template_name_placeholder": "Имя шаблона, напр. WS custom path",
      "template_name_required": "Введите имя шаблона",
      "template_save_failed": "Не удалось сохранить шаблон",
      "template_saved": "Шаблон сохранён",
      "templates": "Шаблоны",
      "templates_builtin": "Встроенные шаблоны",
      "templates_custom": "Мои шаблоны",
      "templates_empty": "Нет шаблонов — сохраните текущую конфигурацию",
      "use_template_btn": "Использовать"
    ,
      "builtin_templates": {
        "ws-basic": {
          "name": "WebSocket базовый",
          "description": "path + Host"
        },
        "ws-cdn": {
          "name": "WebSocket + CDN",
          "description": "Подходит для Cloudflare и других CDN"
        },
        "grpc-basic": {
          "name": "gRPC базовый",
          "description": "serviceName"
        },
        "grpc-multi": {
          "name": "gRPC multiMode",
          "description": "Включить multiMode"
        },
        "http-basic": {
          "name": "HTTP/2 базовый",
          "description": "path + host"
        },
        "tcp-none": {
          "name": "TCP без маскировки",
          "description": "Обычный TCP"
        },
        "tcp-http": {
          "name": "TCP HTTP маскировка",
          "description": "header type = http"
        },
        "xhttp-basic": {
          "name": "XHTTP базовый",
          "description": "режим path"
        },
        "quic-basic": {
          "name": "QUIC базовый",
          "description": "security + key"
        },
        "kcp-basic": {
          "name": "KCP базовый",
          "description": "mtu / tti по умолчанию"
        }
      }},
    "common": {
      "cancel": "Cancel",
      "confirm": "Confirm"
    },
    "messages": {
      "saveFailed": "Не удалось сохранить"
    }
  },
  "coupon": {
    "title": "Управление купонами",
    "description": "Здесь вы можете управлять купонами на скидку, включая их добавление, просмотр и удаление.",
    "table": {
      "columns": {
        "id": "ID",
        "select": "Выбрать",
        "show": "Включен",
        "name": "Название",
        "type": "Тип",
        "code": "Код",
        "limitUse": "Осталось исп.",
        "limitUseWithUser": "Исп. на чел.",
        "validity": "Срок действия",
        "actions": "Действия"
      },
      "validity": {
        "expired": "Истек {{days}} дн. назад",
        "notStarted": "Начнется через {{days}} дн.",
        "remaining": "Осталось {{days}} дн.",
        "startTime": "Начало",
        "endTime": "Конец",
        "unlimited": "Бессрочно",
        "noLimit": "Без лимита"
      },
      "actions": {
        "edit": "Изменить",
        "delete": "Удалить",
        "deleteConfirm": {
          "title": "Подтверждение удаления",
          "description": "Это действие навсегда удалит этот купон. Вы уверены, что хотите продолжить?",
          "confirmText": "Удалить"
        },
        "batchDelete": "Удалить выбранные ({{count}})",
        "batchDeleteConfirm": {
          "title": "Массовое удаление",
          "description": "Вы уверены, что хотите удалить выбранные {{count}} купонов? Это действие нельзя отменить."
        },
        "dropExpired": "Удалить просроченные",
        "dropExpiredConfirm": {
          "title": "Удаление просроченных купонов",
          "description": "Вы уверены, что хотите удалить все просроченные купоны? Это действие нельзя отменить."
        },
        "dropExpiredResult": {
          "success": "Удалено просроченных купонов: {{count}}",
          "empty": "Просроченных купонов не найдено"
        }
      },
      "toolbar": {
        "search": "Поиск купонов...",
        "type": "Тип",
        "reset": "Сбросить",
        "types": {
          "1": "Фиксированная сумма",
          "2": "Процент"
        }
      }
    },
    "form": {
      "add": "Добавить купон",
      "edit": "Изменить купон",
      "name": {
        "label": "Название купона",
        "placeholder": "Введите название купона",
        "required": "Пожалуйста, введите название купона"
      },
      "type": {
        "label": "Тип и значение купона",
        "placeholder": "Выберите тип купона"
      },
      "value": {
        "placeholder": "Введите сумму (юань)"
      },
      "validity": {
        "label": "Срок действия",
        "to": "до",
        "endTimeError": "Время окончания должно быть позже времени начала"
      },
      "limitUse": {
        "label": "Максимальное количество использований",
        "placeholder": "Оставьте пустым для неограниченного использования",
        "description": "Установите общее количество раз, которое этот купон может быть использован"
      },
      "limitUseWithUser": {
        "label": "Лимит на пользователя",
        "placeholder": "Оставьте пустым для неограниченного использования",
        "description": "Ограничьте, сколько раз каждый пользователь может использовать этот купон"
      },
      "limitPeriod": {
        "label": "Периоды подписки",
        "placeholder": "Ограничить конкретными периодами, оставьте пустым для всех",
        "description": "Выберите периоды подписки, для которых применим этот купон",
        "empty": "Периоды не найдены"
      },
      "limitPlan": {
        "label": "Тарифные планы",
        "placeholder": "Ограничить конкретными тарифами, оставьте пустым для всех",
        "description": "Выберите тарифные планы, для которых применим этот купон, оставьте пустым для всех",
        "empty": "Тарифы не найдены"
      },
      "code": {
        "label": "Кастомный код купона",
        "placeholder": "Оставьте пустым для автогенерации",
        "description": "Вы можете задать свой код купона или оставить поле пустым"
      },
      "generateCount": {
        "label": "Количество для генерации",
        "placeholder": "Сколько купонов создать, оставьте пустым для одного",
        "description": "Сгенерировать несколько кодов купонов за один раз"
      },
      "submit": {
        "saving": "Сохранение...",
        "save": "Сохранить"
      },
      "error": {
        "saveFailed": "Не удалось сохранить купон"
      },
      "timeRange": {
        "quickSet": "Быстрая установка",
        "presets": {
          "1week": "1 Неделя",
          "2weeks": "2 Недели",
          "1month": "1 Месяц",
          "3months": "3 Месяца",
          "6months": "6 Месяцев",
          "1year": "1 Год"
        }
      }
    },
    "period": {
      "hourly": "Почасово",
      "daily": "Ежедневно",
      "monthly": "Ежемесячно",
      "quarterly": "Ежеквартально",
      "half_yearly": "Раз в полгода",
      "yearly": "Ежегодно",
      "two_yearly": "Раз в 2 года",
      "three_yearly": "Раз в 3 года",
      "onetime": "Единоразово",
      "reset_traffic": "Сброс трафика"
    }
  },
  "route": {
    "title": "Управление маршрутами",
    "description": "Управление группами маршрутов, включая добавление, удаление и редактирование.",
    "columns": {
      "id": "ID группы",
      "remarks": "Примечание",
      "action": "Действие",
      "actions": "Действия",
      "matchRules": "Правил совпадения: {{count}}",
      "action_value": {
        "title": "Значение действия",
        "dns": "DNS: {{value}}",
        "proxy": "Прокси ({{value}})",
        "block": "Блокировать доступ",
        "direct": "Прямое соединение"
      }
    },
    "actions": {
      "dns": "Разрешать через DNS",
      "block": "Блокировать",
      "direct": "Напрямую",
      "proxy": "Прокси",
      "short": {
        "dns": "DNS",
        "block": "Блок",
        "direct": "Прямой",
        "proxy": "Прокси"
      }
    },
    "form": {
      "add": "Добавить маршрут",
      "edit": "Изменить маршрут",
      "create": "Создать маршрут",
      "remarks": "Примечание",
      "remarksPlaceholder": "Введите примечание",
      "match": "Правила совпадения",
      "matchPlaceholder": "example.com\n*.example.com",
      "action": "Действие",
      "actionPlaceholder": "Выберите действие",
      "dns": "DNS Сервер",
      "dnsPlaceholder": "Введите DNS сервер",
      "proxy": "Тег выхода",
      "proxyPlaceholder": "Введите тег выхода (Outbound Tag)",
      "cancel": "Отмена",
      "submit": "Отправить",
      "validation": {
        "remarks": "Введите корректное примечание"
      }
    },
    "toolbar": {
      "searchPlaceholder": "Поиск маршрутов...",
      "reset": "Сбросить"
    },
    "messages": {
      "deleteConfirm": "Подтверждение удаления",
      "deleteDescription": "Это действие навсегда удалит эту группу маршрутов. Продолжить?",
      "deleteButton": "Удалить",
      "deleteSuccess": "Удалено успешно",
      "createSuccess": "Создано успешно",
      "updateSuccess": "Обновлено успешно"
    }
  },
  "ticket": {
    "title": "Управление тикетами",
    "description": "Просмотр и управление обращениями пользователей, включая ответы и закрытие тикетов.",
    "columns": {
      "id": "ID тикета",
      "subject": "Тема",
      "level": "Приоритет",
      "status": "Статус",
      "updated_at": "Обновлен",
      "created_at": "Создан",
      "actions": "Действия"
    },
    "status": {
      "closed": "Закрыт",
      "replied": "Отвечен",
      "pending": "Ожидание",
      "processing": "В обработке",
      "unreplied": "Без ответа"
    },
    "level": {
      "low": "Низкий",
      "medium": "Средний",
      "high": "Высокий"
    },
    "filter": {
      "placeholder": "Поиск {field}...",
      "no_results": "Результатов не найдено",
      "selected": "Выбрано: {count}",
      "clear": "Очистить фильтры"
    },
    "actions": {
      "reply_success": "Ответ отправлен",
      "view_details": "Детали",
      "close_ticket": "Закрыть тикет",
      "close_confirm_title": "Подтверждение закрытия",
      "close_confirm_description": "Вы уверены, что хотите закрыть этот тикет? Он переместится в список закрытых, но отвечать в нем все равно можно.",
      "close_confirm_button": "Закрыть тикет",
      "close_success": "Тикет успешно закрыт",
      "view_ticket": "Посмотреть тикет"
    },
    "detail": {
      "no_messages": "Сообщений нет",
      "created_at": "Создан",
      "sender_admin": "Админ",
      "sender_user": "Пользователь",
      "user_info": "Инфо о пользователе",
      "traffic_records": "История трафика",
      "order_records": "История заказов",
      "input": {
        "closed_reply_placeholder": "Тикет закрыт, но вы все еще можете ответить...",
        "closed_hint": "Тикет закрыт, но вы все еще можете отвечать. Новые сообщения будут добавлены в текущий тикет.",
        "reply_placeholder": "Введите ваш ответ...",
        "sending": "Отправка...",
        "send": "Отправить",
        "shortcut_hint": "Enter — отправить · Shift + Enter — новая строка"
      }
    },
    "list": {
      "title": "Список тикетов",
      "search_placeholder": "Поиск по теме или email",
      "no_tickets": "Тикетов нет",
      "no_open_tickets": "Нет открытых тикетов",
      "no_closed_tickets": "Нет закрытых тикетов",
      "no_search_results": "Тикеты не найдены",
      "collapse": "Свернуть список",
      "expand": "Развернуть список"
    }
  },
    "withdrawal": {
    "title": "Управление выплатами",
    "description": "Управление заявками на выплату комиссии пользователей, поддержка подтверждения и отклонения.",
    "columns": {
      "id": "ID",
      "user": "Пользователь",
      "method": "Способ",
      "account": "Счёт",
      "amount": "Сумма",
      "status": "Статус",
      "created_at": "Создано",
      "actions": "Действия"
    },
    "status": {
      "pending": "Ожидает",
      "confirmed": "Подтверждено",
      "closed": "Закрыто"
    },
    "filter": {
      "all": "Все"
    },
    "actions": {
      "view": "Подробнее",
      "confirm": "Подтвердить",
      "close": "Закрыть",
      "user_info": "Инфо о пользователе",
      "confirm_title": "Подтвердить выплату",
      "confirm_description": "Подтверждение закроет заявку. Убедитесь, что платёж обработан.",
      "confirm_button": "Подтвердить",
      "confirm_success": "Выплата подтверждена",
      "close_confirm_title": "Закрыть выплату",
      "close_confirm_description": "Закрытие вернёт комиссию на счёт пользователя.",
      "close_confirm_button": "Закрыть",
      "close_success": "Выплата закрыта, комиссия возвращена",
      "reply_success": "Ответ отправлен"
    },
    "list": {
      "search_placeholder": "Поиск счёта выплаты...",
      "no_withdrawals": "Нет записей о выплатах",
      "no_open_withdrawals": "Нет ожидающих выплат",
      "title": "Список выплат",
      "collapse": "Свернуть",
      "expand": "Развернуть"
    },
    "detail": {
      "created_at": "Создано",
      "user_info": "Инфо о пользователе",
      "traffic_records": "Трафик",
      "order_records": "Заказы",
      "no_messages": "Нет сообщений",
      "operator": "Оператор",
      "remark": "Примечание",
      "remark_placeholder": "Введите примечание (необязательно)",
      "sender_user": "Пользователь",
      "sender_admin": "Администратор",
      "input": {
        "closed_hint": "Этот запрос на вывод уже обработан, ответы недоступны",
        "reply_placeholder": "Введите сообщение...",
        "closed_reply_placeholder": "Этот запрос на вывод уже обработан",
        "send": "Отправить",
        "sending": "Отправка...",
        "shortcut_hint": "Enter для отправки, Shift+Enter для новой строки"
      }
    }
  },

  "machine": {
    "title": "Управление серверами",
    "description": "Просматривайте состояние сервера, нагрузку и размещённые узлы, а также управляйте службой Fboard-Node.",
    "columns": {
      "id": "ID",
      "name": "Имя сервера",
      "status": "Статус",
      "nodes": "Узлы",
      "nodesHosted": "Узлы",
      "nodesIdle": "нет узлов",
      "load": "Нагрузка",
      "lastSeen": "Последний отклик",
      "version": "Версия",
      "actions": "Действия",
      "online": "Онлайн",
      "offline": "Оффлайн",
      "inactive": "Отключён",
      "noData": "Нет данных о нагрузке",
      "cpu": "CPU",
      "memory": "Память",
      "disk": "Диск",
      "never": "Никогда",
      "lastReport": "Отчёт о нагрузке",
      "kernel": "Ядро",
      "kernelRunning": "Работает",
      "kernelStopped": "Остановлено",
      "kernelPartial": "Частично",
      "kernelIdle": "Нет узлов",
      "kernelUnknown": "Неизвестно",
      "kernelDetail": "{{running}}/{{total}} работают"
    },
    "toolbar": {
      "search": "Поиск по имени сервера, заметкам или SID...",
      "status": "Статус",
      "status_all": "Все статусы",
      "status_online": "Онлайн",
      "status_offline": "Оффлайн",
      "status_inactive": "Отключён",
      "status_high_load": "Высокая нагрузка",
      "nodes": "Узлы",
      "nodesHosted": "Узлы",
      "nodesIdle": "простой",
      "with_nodes": "С размещёнными узлами",
      "idle_nodes": "Свободные серверы",
      "high_load": "Высокая нагрузка",
      "online_ratio": "Онлайн",
      "high_load_count": "Высокая нагрузка",
      "tip": "Страница помогает быстро оценить состояние серверов, число размещённых узлов и нагрузку ресурсов.",
      "reset": "Сбросить"
    },
    "operations": {
      "upgrade": "Обновить Fboard-Node",
      "ops": "Операции ядра",
      "start": "Запустить ядро",
      "stop": "Остановить ядро",
      "reload": "Перезагрузить ядро",
      "restart": "Перезапустить ядро",
      "upgradeTitle": "Подтверждение обновления сервера",
      "upgradeDescription": "Fboard-Node на сервере «{{name}}» будет обновлён. Во время обновления служба может быть кратковременно недоступна.",
      "startTitle": "Подтверждение запуска ядра",
      "startDescription": "Будет запущено встроенное ядро xray для всех узлов на сервере «{{name}}». Процесс fboard-node и WebSocket продолжат работу.",
      "stopTitle": "Подтверждение остановки ядра",
      "stopDescription": "Будет остановлено встроенное ядро xray для всех узлов на сервере «{{name}}». Прокси будет недоступен до повторного запуска. Процесс и WebSocket продолжат работу.",
      "reloadTitle": "Подтверждение перезагрузки ядра",
      "reloadDescription": "Будет перезагружена конфигурация встроенного ядра xray для всех узлов на сервере «{{name}}». Процесс и WebSocket продолжат работу.",
      "restartTitle": "Подтверждение перезапуска ядра",
      "restartDescription": "Встроенное ядро xray на сервере «{{name}}» будет принудительно пересоздано. Прокси кратко прервётся; процесс fboard-node и WebSocket продолжат работу.",
      "upgradeSubmitted": "Задача обновления сервера «{{name}}» отправлена",
      "startSubmitted": "Задача запуска ядра для «{{name}}» отправлена",
      "stopSubmitted": "Задача остановки ядра для «{{name}}» отправлена",
      "reloadSubmitted": "Задача перезагрузки ядра для «{{name}}» отправлена",
      "restartSubmitted": "Задача перезапуска ядра для «{{name}}» отправлена",
      "batchUpgrade": "Обновить все серверы",
      "batchUpgradeTitle": "Подтверждение пакетного обновления серверов",
      "batchUpgradeDescription": "Для каждого активного сервера онлайн будет отправлена одна задача обновления Fboard-Node. Количество размещённых узлов не имеет значения.",
      "batchUpgradeSubmitted": "Отправлено серверов: {{submitted}}; пропущено отключённых: {{inactive}}, офлайн: {{offline}}"
    },

    "overview": {
      "total": "Всего серверов",
      "total_hint": "Всего размещено узлов: {{count}}",
      "online": "Серверы онлайн",
      "online_hint": "Есть heartbeat за последние 5 минут",
      "offline": "Оффлайн / Потеряны",
      "offline_hint": "Требуется проверить heartbeat или агент",
      "high_load": "Высокая нагрузка",
      "high_load_hint": "CPU, память или диск близки к порогу",
      "nodes_suffix": "узлов",
      "attention": "Внимание",
      "stable": "Стабильно",
      "needs_review": "Проверить",
      "normal": "Норма"
    },
    "form": {
      "add": "Добавить сервер",
      "create": "Новый сервер",
      "edit": "Редактировать сервер",
      "createDescription": "Создайте новый сервер для управления несколькими узлами.",
      "editDescription": "Изменить имя, заметки или статус сервера.",
      "name": "Имя сервера",
      "namePlaceholder": "Например HK-01",
      "nameError": "Введите имя сервера",
      "notes": "Заметки",
      "notesPlaceholder": "Необязательные заметки о сервере",
      "isActive": "Включить сервер",
      "isActiveDescription": "Отключённые серверы не используются Fboard-Node.",
      "cancel": "Отмена",
      "submit": "Сохранить",
      "update": "Обновить"
    },
    "token": {
      "title": "Токен сервера",
      "description": "Этот токен используется Fboard-Node для аутентификации. Храните его в безопасности.",
      "show": "Показать токен",
      "hide": "Скрыть токен",
      "reset": "Сбросить токен",
      "resetConfirm": "Сбросить токен?",
      "resetDescription": "Старый токен будет немедленно аннулирован. Fboard-Node потребует перенастройки.",
      "copy": "Копировать",
      "copied": "Токен скопирован",
      "copiedInline": "Скопировано!",
      "copyFailed": "Ошибка копирования",
      "autoHide": "Скроется через {{time}}",
      "resetSuccess": "Токен сброшен",
      "createdHint": "Токен создан. Вы можете просмотреть его в любое время на странице сервера."
    },
    "install": {
      "title": "Установить Fboard-Node",
      "description": "Выполните эту команду на целевом сервере, чтобы установить Fboard-Node в режиме machine mode и подключить его к текущей записи сервера.",
      "copy": "Копировать команду установки",
      "copied": "Команда установки скопирована",
      "copiedInline": "Скопировано!",
      "copyFailed": "Ошибка копирования",
      "loading": "Генерация команды...",
      "hint": "Требуются root или sudo, а также Linux-сервер с systemd."
    },
    "detail": {
      "title": "Детали сервера",
      "info": "Информация",
      "associatedNodes": "Связанные узлы",
      "noNodes": "К этому серверу не привязаны узлы.",
      "nodeId": "ID",
      "nodeName": "Имя",
      "nodeType": "Тип",
      "nodeHost": "Адрес",
      "nodePort": "Порт",
      "nodeShow": "Видимый",
      "nodeEnabled": "Активен",
      "loadTrend": "Тренд нагрузки",
      "networkTrend": "Скорость сети",
      "noHistory": "История нагрузки пока отсутствует.",
      "openNodeManage": "Открыть управление узлами",
      "addNodeToServer": "Добавить узел на этот сервер",
      "nodeCount": "{{count}} узлов",
      "nodeEnabledCount": "{{count}} активных",
      "toggleEnabledError": "Не удалось переключить состояние узла",
      "bindExistingButton": "Привязать существующие",
      "bindExistingTitle": "Привязать существующие узлы",
      "bindExistingDescription": "Выберите узлы для привязки к «{{name}}»",
      "bindSearchPlaceholder": "Поиск по имени, адресу, типу...",
      "bindTypeAll": "Все типы",
      "noUnboundNodes": "Нет свободных узлов",
      "noSearchResults": "Нет совпадений",
      "selectAll": "Выбрать все ({{count}})",
      "selectedCount": "{{count}} выбрано",
      "bindConfirm": "Привязать {{count}} узлов",
      "binding": "Привязка...",
      "bindSuccess": "Успешно привязано {{count}} узлов к «{{name}}»",
      "bindFailed": "Ошибка привязки",
      "unbindNode": "Отвязать",
      "unbindSuccess": "«{{name}}» отвязан",
      "unbindFailed": "Ошибка отвязки",
      "unbindConfirmTitle": "Подтвердите отвязку",
      "unbindConfirmDescription": "Узел «{{name}}» будет отвязан от этого сервера (сам узел не будет удалён).",
      "cancel": "Отмена"
    },
    "messages": {
      "createSuccess": "Сервер успешно создан",
      "updateSuccess": "Сервер успешно обновлён",
      "deleteConfirm": "Удалить сервер?",
      "deleteDescription": "Связанные узлы будут отвязаны (не удалены). Это действие необратимо.",
      "deleteButton": "Удалить",
      "deleteSuccess": "Сервер успешно удалён",
      "deleteFailed": "Не удалось удалить сервер",
      "saveFailed": "Не удалось сохранить сервер",
      "tokenFetchFailed": "Не удалось получить токен",
      "tokenResetFailed": "Не удалось сбросить токен"
    },
    "nodeForm": {
      "machineId": "Привязать к серверу",
      "machineIdPlaceholder": "Выберите сервер (необязательно)",
      "machineIdNone": "Автономное развёртывание",
      "enabled": "Активен на сервере",
      "enabledDescription": "Запускать ли узел на привязанном сервере"
    },
    "nodesStatus": {
      "toggleHint": "Измените статус в управлении узлами"
    },
    "logs": {
      "autoScroll": "Автопрокрутка вниз",
      "copied": "Лог скопирован",
      "copy": "Копировать лог",
      "description": "Недавние логи процесса Fboard-Node в памяти (до ~1000 строк).",
      "empty": "Нет логов",
      "fetchFailed": "Не удалось получить логи",
      "lineCount": "{{count}} строк",
      "loading": "Загрузка логов...",
      "offline": "Сервер офлайн, нельзя получить логи в реальном времени",
      "refresh": "Обновить лог",
      "stale": "Показан кэш логов (может быть устаревшим)",
      "timeout": "Таймаут ожидания ответа узла",
      "title": "Журнал работы",
      "updatedAt": "Обновлено {{time}}"
    }
  },
  "search": {
    "placeholder": "Поиск меню и функций...",
    "title": "Навигация по меню",
    "noResults": "Результатов не найдено",
    "shortcut": {
      "label": "Поиск",
      "key": "⌘K"
    }
  },
  "knowledge": {
    "title": "База знаний",
    "description": "Здесь вы можете управлять статьями базы знаний, включая их добавление, удаление и редактирование.",
    "columns": {
      "id": "ID",
      "status": "Статус",
      "title": "Заголовок",
      "category": "Категория",
      "actions": "Действия"
    },
    "form": {
      "add": "Добавить статью",
      "edit": "Изменить статью",
      "title": "Заголовок",
      "titlePlaceholder": "Введите заголовок статьи",
      "category": "Категория",
      "categoryPlaceholder": "Введите категорию для автоматической группировки",
      "language": "Язык",
      "languagePlaceholder": "Выберите язык",
      "content": "Содержимое",
      "show": "Показывать",
      "cancel": "Отмена",
      "submit": "Отправить"
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
      "deleteConfirm": "Подтверждение удаления",
      "deleteDescription": "Это действие навсегда удалит статью из базы знаний. Вы уверены, что хотите продолжить?",
      "deleteButton": "Удалить",
      "operationSuccess": "Операция выполнена успешно",
      "loadError": "Ошибка загрузки"
    },
    "toolbar": {
      "searchPlaceholder": "Поиск по базе знаний...",
      "reset": "Сбросить",
      "sortModeHint": "Перетаскивайте элементы для сортировки, затем нажмите сохранить",
      "editSort": "Изменить порядок",
      "saveSort": "Сохранить порядок"
    ,
      "allCategories": "Все категории"
    }
  },
  "common": {
    "all": "Все",
    "clear": "Очистить",
    "selectAll": "Выбрать все",
    "loading": "Загрузка...",
    "error": "Ошибка",
    "success": "Успех",
    "save": "Сохранить",
    "cancel": "Отмена",
    "confirm": "Подтвердить",
    "close": "Закрыть",
    "delete": {
      "success": "Удалено успешно",
      "failed": "Не удалось удалить"
    },
    "edit": "Редактировать",
    "view": "Просмотр",
    "toggleNavigation": "Переключить навигацию",
    "toggleSidebar": "Переключить боковую панель",
    "search": "Поиск...",
    "theme": {
      "label": "Тема",
      "light": "Светлая",
      "dark": "Темная",
      "system": "Системная"
    },
    "noMatch": "Нет совпадений",
    "selectField": "Выберите {{name}}",
    "inputField": "Введите {{name}}",
    "pageNotImplemented": "Страница ещё не реализована",
    "user": "Пользователь",
    "defaultEmail": "user@example.com",
    "settings": "Настройки",
    "logout": "Выйти",
    "copy": {
      "success": "Скопировано успешно",
      "failed": "Не удалось скопировать",
      "error": "Ошибка копирования",
      "errorLog": "Ошибка при копировании в буфер обмена"
    },
    "submit": "Отправить",
    "saving": "Сохранение...",
    "table": {
      "noData": "Нет данных",
      "pagination": {
        "selected": "Выбрано {{selected}} из {{total}}",
        "itemsPerPage": "На странице",
        "page": "Страница",
        "pageOf": "Страница {{page}} / {{total}}",
        "range": "{{from}}–{{to}} из {{total}}",
        "firstPage": "На первую страницу",
        "previousPage": "Предыдущая страница",
        "nextPage": "Следующая страница",
        "lastPage": "На последнюю страницу"
      },
      "viewOptions": {
        "button": "Столбцы",
        "label": "Переключить видимость столбцов"
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
      "notLoggedIn": "Не выполнен вход",
      "unknownError": "Неизвестная ошибка",
      "loginExpired": "Сессия истекла",
      "loginExpiredRelogin": "Сессия истекла, войдите снова",
      "unauthorized": "Нет доступа, войдите снова",
      "invalidCredentials": "Неверный email или пароль",
      "invalidData": "Некорректные данные, проверьте ввод",
      "requestFailed": "Ошибка запроса",
      "networkError": "Ошибка сети",
      "noPermission": "Нет прав",
      "notFound": "Ресурс или API не найден",
      "unknownException": "Неизвестное исключение",
      "success": "Успешно"
    },
    "add": "Добавить",
    "refresh": "Обновить",
    "sort": {
      "edit": "Изменить порядок",
      "done": "Завершить сортировку"
    },
    "actions": "Действия",
    "start": "С",
    "end": "По"
  },
  "plugin": {
    "title": "Управление плагинами",
    "description": "Управление и настройка системных плагинов",
    "search": {
      "placeholder": "Поиск по названию или описанию..."
    },
    "type": {
      "placeholder": "Выберите тип плагина",
      "all": "Все типы"
    },
    "tabs": {
      "all": "Все плагины",
      "installed": "Установленные",
      "available": "Доступные"
    },
    "status": {
      "enabled": "Включено",
      "disabled": "Отключено",
      "not_installed": "Не установлено",
      "protected": "Защищено",
      "filter_placeholder": "Статус управления",
      "all": "Все статусы",
      "installed": "Установленные",
      "available": "Доступные"
    },
    "button": {
      "install": "Установить",
      "upgrade": "Обновить",
      "config": "Настроить",
      "enable": "Включить",
      "disable": "Отключить",
      "uninstall": "Удалить",
      "readme": "Документация",
      "menuDemo": "Демо меню"
    },
    "upload": {
      "button": "Загрузить плагин",
      "title": "Загрузить плагин",
      "description": "Загрузите пакет плагина (.zip)",
      "dragText": "Перетащите пакет плагина сюда или",
      "clickText": "выберите файл",
      "supportText": "Поддерживаются только .zip файлы",
      "uploading": "Загрузка...",
      "error": {
        "format": "Поддерживаются только .zip файлы"
      }
    },
    "delete": {
      "title": "Удалить плагин",
      "description": "Вы уверены, что хотите удалить этот плагин? Это действие нельзя отменить.",
      "button": "Удалить"
    },
    "uninstall": {
      "title": "Удалить плагин из системы",
      "description": "Вы уверены, что хотите удалить этот плагин? Все данные плагина будут стерты.",
      "button": "Удалить"
    },
    "upgrade": {
      "title": "Обновить плагин",
      "description": "Вы уверены, что хотите обновить этот плагин? Он будет временно недоступен в процессе.",
      "button": "Обновить"
    },
    "config": {
      "title": "Конфигурация",
      "description": "Изменение настроек плагина",
      "save": "Сохранить",
      "cancel": "Отмена",
      "noConfigs": "У этого плагина нет настраиваемых параметров",
      "actions": "Действия",
      "noPlan": "Без тарифа",
      "selectPlan": "Выберите тариф"
    },
    "readme": {
      "title": "Документация плагина",
      "empty": "Нет документации"
    },
    "author": "Автор",
    "messages": {
      "installSuccess": "Плагин успешно установлен",
      "installError": "Ошибка при установке плагина",
      "upgradeSuccess": "Плагин успешно обновлен",
      "upgradeError": "Ошибка при обновлении плагина",
      "uninstallSuccess": "Плагин успешно удален",
      "uninstallError": "Ошибка при удалении плагина",
      "enableSuccess": "Плагин включен",
      "enableError": "Ошибка включения плагина",
      "disableSuccess": "Плагин отключен",
      "disableError": "Ошибка отключения плагина",
      "configLoadError": "Ошибка загрузки конфигурации плагина",
      "configSaveSuccess": "Конфигурация сохранена",
      "configSaveError": "Ошибка сохранения конфигурации",
      "uploadSuccess": "Плагин загружен",
      "uploadError": "Ошибка загрузки плагина",
      "deleteSuccess": "Плагин удален",
      "deleteError": "Ошибка удаления плагина",
      "actionError": "Ошибка выполнения",
      "actionSuccess": "Выполнено успешно",
      "actionLabel": "Действие",
      "actionSuccessWithLabel": "{{label}} выполнено успешно",
      "actionErrorWithLabel": "{{label}} не выполнено",
      "invalidJson": "{{field}} не является корректным JSON"
    },
    "staticFiles": {
      "title": "HTML статические файлы",
      "previewTitle": "Предпросмотр HTML плагина",
      "backToList": "Назад к списку",
      "openInNewTab": "Открыть в новой вкладке",
      "empty": "Нет статических файлов"
    },
    "noPlugins": "Нет плагинов",
    "toolbar": {
      "search": "Поиск плагинов..."
    }
  },
  "dashboard": {
    "title": "Панель управления",
    "stats": {
      "newUsers": "Новые пользователи",
      "totalScore": "Общий балл",
      "monthlyUpload": "Загружено за месяц",
      "vsLastMonth": "к прошлому месяцу",
      "vsYesterday": "со вчера",
      "todayIncome": "Доход за сегодня",
      "monthlyIncome": "Доход за месяц",
      "totalIncome": "Общий доход",
      "totalUsers": "Всего пользователей",
      "activeUsers": "Активных: {{count}}",
      "totalOrders": "Всего заказов",
      "revenue": "Выручка",
      "todayRegistered": "Зарегистрировано сегодня",
      "monthlyRegistered": "Зарегистрировано за месяц",
      "onlineUsers": "Онлайн",
      "pendingTickets": "Открытых тикетов",
      "hasPendingTickets": "Есть тикеты, требующие ответа",
      "noPendingTickets": "Нет открытых тикетов",
      "pendingCommission": "Комиссии на выплату",
      "hasPendingCommission": "Есть комиссии, требующие подтверждения",
      "noPendingCommission": "Нет комиссий на выплату",
      "monthlyNewUsers": "Новых за месяц",
      "monthlyDownload": "Скачано за месяц",
      "todayTraffic": "Сегодня: {{value}}",
      "activeUserTrend": "Тренды активности",
      "realtimeUsers": "Пользователи в реальном времени",
      "todayPeak": "Пик за сегодня",
      "vsLastWeek": "к прошлой неделе"
    },
    "trafficRank": {
      "nodeTrafficRank": "Рейтинг узлов",
      "userTrafficRank": "Рейтинг пользователей",
      "today": "Сегодня",
      "last7days": "7 дней",
      "last30days": "30 дней",
      "customRange": "Свой диапазон",
      "selectTimeRange": "Выбрать период",
      "selectDateRange": "Выбрать даты",
      "currentTraffic": "Трафик за период",
      "previousTraffic": "Трафик ранее",
      "changeRate": "Изменение",
      "recordTime": "Время записи"
    },
    "overview": {
      "title": "Обзор доходов",
      "thisMonth": "Этот месяц",
      "lastMonth": "Прошлый месяц",
      "to": "по",
      "selectTimeRange": "Выбрать диапазон",
      "selectDate": "Выбрать дату",
      "last7Days": "7 дней",
      "last30Days": "30 дней",
      "last90Days": "90 дней",
      "last180Days": "180 дней",
      "lastYear": "Год",
      "customRange": "Свой диапазон",
      "amount": "Сумма",
      "count": "Количество",
      "transactions": "Транзакций: {{count}}",
      "orderAmount": "Сумма заказов",
      "commissionAmount": "Сумма комиссий",
      "orderCount": "Заказов",
      "commissionCount": "Комиссий",
      "totalIncome": "Прибыль",
      "totalCommission": "Всего комиссий",
      "totalTransactions": "Транзакций: {{count}}",
      "avgOrderAmount": "Средний чек:",
      "commissionRate": "Доля комиссий:"
    },
    "traffic": {
      "title": "Рейтинг трафика",
      "rank": "Рейтинг",
      "domain": "Домен",
      "todayTraffic": "Трафик за сегодня",
      "monthlyTraffic": "Месячный трафик"
    },
    "queue": {
      "title": "Очереди",
      "metrics": {
        "pending": "В очереди {{count}}",
        "maxWait": "Макс. ожидание {{time}}",
        "backlog": "Затор",
        "processes": "Процессы",
        "pendingLabel": "В очереди",
        "wait": "Ожидание"
      },
      "jobDetails": "Детали задачи",
      "workload": "Нагрузка очередей",
      "workloadCount": "Очередей: {{count}}",
      "status": {
        "description": "Статус Horizon и накопление по очередям",
        "running": "Статус",
        "normal": "Норма",
        "abnormal": "Ошибка",
        "waitTime": "Ожидание: {{seconds}} сек.",
        "pending": "В очереди",
        "processing": "В процессе",
        "completed": "Завершено",
        "failed": "Ошибка",
        "cancelled": "Отменено"
      },
      "details": {
        "description": "Технические детали очередей",
        "recentJobs": "Последние задачи",
        "statisticsPeriod": "Период статистики: {{hours}} ч.",
        "jobsPerMinute": "Задач в минуту",
        "maxThroughput": "Пиковая нагрузка: {{value}}",
        "failedJobs7Days": "Ошибки (7 дней)",
        "retentionPeriod": "Период хранения: {{hours}} ч.",
        "longestRunningQueue": "Самая длинная очередь",
        "activeProcesses": "Активные процессы",
        "id": "ID задачи",
        "type": "Тип задачи",
        "status": "Статус",
        "progress": "Прогресс",
        "createdAt": "Создано",
        "updatedAt": "Обновлено",
        "error": "Ошибка",
        "data": "Данные задачи",
        "result": "Результат",
        "duration": "Длительность",
        "attempts": "Попыток",
        "nextRetry": "Минут до повтора",
        "failedJobsDetailTitle": "Ошибки очередей",
        "viewFailedJobs": "Ошибки",
        "jobDetailTitle": "Детали выполнения",
        "time": "Время",
        "queue": "Очередь",
        "name": "Имя задачи",
        "exception": "Исключение",
        "noException": "Нет информации об ошибке",
        "noFailedJobs": "Ошибок не найдено",
        "connection": "Соединение",
        "payload": "Payload",
        "viewDetail": "Детали",
        "action": "Действие"
      },
      "actions": {
        "retry": "Повтор",
        "cancel": "Отмена",
        "delete": "Удалить",
        "viewDetails": "Подробнее"
      },
      "empty": "Задач не найдено",
      "loading": "Загрузка статуса очередей...",
      "error": "Ошибка загрузки статуса"
    },
    "common": {
      "refresh": "Обновить",
      "close": "Закрыть",
      "pagination": "Страница {{current}}/{{total}}, всего {{count}}"
    },
    "search": {
      "placeholder": "Поиск меню и функций...",
      "title": "Навигация по меню",
      "noResults": "Результаты не найдены",
      "loading": "Поиск..."
    }
  },
  "order": {
    "title": "Управление заказами",
    "description": "Здесь вы можете просматривать заказы пользователей, включая назначение, просмотр, удаление и другие операции.",
    "table": {
      "columns": {
        "tradeNo": "№ Заказа",
        "type": "Тип",
        "user": "Пользователь",
        "plan": "Тарифный план",
        "period": "Период",
        "amount": "Сумма оплаты",
        "status": "Статус заказа",
        "commission": "Комиссия",
        "commissionStatus": "Статус комиссии",
        "createdAt": "Создан",
        "actions": "Действия"
      }
    },
    "type": {
      "NEW": "Новая покупка",
      "RENEWAL": "Продление",
      "UPGRADE": "Апгрейд (Переход)",
      "RESET_FLOW": "Сброс трафика",
      "DEPOSIT": "Пополнение баланса"
    },
    "period": {
      "hour_price": "Почасово",
      "day_price": "Ежедневно",
      "month_price": "Ежемесячно",
      "quarter_price": "Ежеквартально",
      "half_year_price": "Раз в полгода",
      "year_price": "Ежегодно",
      "two_year_price": "Раз в 2 года",
      "three_year_price": "Раз в 3 года",
      "onetime_price": "Единоразово",
      "reset_price": "Пакет сброса",
      "deposit": "Пополнение баланса",
      "hourly": "Почасово",
      "daily": "Ежедневно",
      "half_yearly": "Раз в полгода",
      "monthly": "Ежемесячно",
      "onetime": "Единоразово",
      "quarterly": "Ежеквартально",
      "reset_traffic": "Сброс трафика",
      "three_yearly": "Раз в 3 года",
      "two_yearly": "Раз в 2 года",
      "yearly": "Ежегодно"
    },
    "status": {
      "PENDING": "Ожидание",
      "PROCESSING": "В обработке",
      "CANCELLED": "Отменен",
      "COMPLETED": "Завершен",
      "DISCOUNTED": "Скидка",
      "tooltip": "После пометки [Оплачено] система выполнит активацию и завершит заказ"
    },
    "commission": {
      "PENDING": "Ожидание",
      "PROCESSING": "В обработке",
      "VALID": "Действительна",
      "INVALID": "Недействительна"
    },
    "filter": {
      "allTypes": "Все типы",
      "allPeriods": "Все периоды",
      "allStatuses": "Все статусы",
      "allCommissions": "Все статусы комиссии",
      "userId": "ID пользователя",
      "clear": "Очистить",
      "clearAll": "Сбросить фильтры"
    },
    "actions": {
      "view": "Подробности",
      "markAsPaid": "Пометить как оплаченный",
      "cancel": "Отменить заказ",
      "issue": "Выдать комиссию",
      "invalid": "Отменить комиссию",
      "openMenu": "Открыть меню",
      "reset": "Сбросить",
      "copyTradeNo": "Копировать № заказа"
    },
    "search": {
      "placeholder": "Поиск по № заказа..."
    },
    "dialog": {
      "title": "Информация о заказе",
      "basicInfo": "Основная информация",
      "amountInfo": "Информация о стоимости",
      "timeInfo": "Временные метки",
      "commissionInfo": "Информация о комиссии",
      "commissionStatusActive": "Активна",
      "addOrder": "Добавить заказ",
      "assignOrder": "Назначить заказ",
      "fields": {
        "userEmail": "Email пользователя",
        "userPhone": "Телефон пользователя",
        "orderPeriod": "Период заказа",
        "subscriptionPlan": "Тарифный план",
        "callbackNo": "№ Транзакции (Callback)",
        "paymentAmount": "Сумма к оплате",
        "balancePayment": "Оплата с баланса",
        "discountAmount": "Сумма скидки",
        "refundAmount": "Сумма возврата",
        "deductionAmount": "Сумма вычета",
        "createdAt": "Дата создания",
        "updatedAt": "Дата обновления",
        "commissionStatus": "Статус комиссии",
        "commissionAmount": "Заработок комиссии",
        "actualCommissionAmount": "Фактическая комиссия",
        "inviteUser": "Пригласитель",
        "inviteUserId": "ID пригласителя"
      },
      "placeholders": {
        "email": "Введите email пользователя",
        "plan": "Выберите тарифный план",
        "period": "Выберите период подписки",
        "amount": "Введите сумму оплаты"
      },
      "actions": {
        "cancel": "Отмена",
        "confirm": "Подтвердить"
      },
      "messages": {
        "addOrder": "Заказ успешно добавлен",
        "addSuccess": "Успешно добавлено"
      }
    },
    "messages": {
      "addSuccess": "Успешно добавлено",
      "markPaidSuccess": "Отмечено как оплаченный",
      "cancelSuccess": "Заказ отменён",
      "cancelConfirm": "Отменить этот заказ?",
      "commissionIssueSuccess": "Комиссия выдана",
      "commissionInvalidSuccess": "Комиссия помечена как недействительная",
      "commissionInvalidConfirm": "Пометить эту комиссию как недействительную?"
    }
  },
  "theme": {
    "title": "Конфигурация тем",
    "description": "Конфигурация тем, включая цвета, размеры шрифтов и т.д. Если вы развернули Fboard с раздельным фронтендом и бэкендом, конфигурация тем не вступит в силу.",
    "upload": {
      "button": "Загрузить тему",
      "title": "Загрузить тему",
      "description": "Пожалуйста, загрузите корректный пакет темы (формат .zip). Пакет должен содержать полную структуру файлов темы.",
      "dragText": "Перетащите файл темы сюда или",
      "clickText": "нажмите для выбора",
      "supportText": "Поддерживаются пакеты тем в формате .zip",
      "uploading": "Загрузка...",
      "success": "Загрузка выполнена",
      "error": {
        "format": "Поддерживаются только файлы тем в формате ZIP"
      }
    },
    "preview": {
      "title": "Предпросмотр темы",
      "imageCount": "{{current}} / {{total}}"
    },
    "card": {
      "version": "Версия: {{version}}",
      "currentTheme": "Текущая тема",
      "activateTheme": "Активировать тему",
      "activateSuccess": "Тема активирована",
      "configureTheme": "Настройки темы",
      "preview": "Предпросмотр",
      "delete": {
        "title": "Удалить тему",
        "description": "Вы уверены, что хотите удалить эту тему? Это действие нельзя отменить.",
        "button": "Удалить",
        "error": {
          "active": "Нельзя удалить активную тему"
        }
      }
    },
    "config": {
      "title": "Настройка темы {{name}}",
      "description": "Изменение стилей темы, макетов и других параметров отображения.",
      "cancel": "Отмена",
      "save": "Сохранить",
      "success": "Настройки успешно сохранены",
      "noConfigs": "У этой темы нет настраиваемых параметров",
      "error": "Ошибка сохранения"
    }
  }
};

window.FBOARD_TRANSLATIONS = window.FBOARD_TRANSLATIONS ?? {};
window.FBOARD_TRANSLATIONS["ru-RU"] = translations;
