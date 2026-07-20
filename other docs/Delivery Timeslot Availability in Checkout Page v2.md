# Delivery Timeslot Availability in Checkout Page

# get available delivery timeslots

## Request Stub (HTTP)

```http
GET /get_available_delivery_time_slots?districtCode=HKI&estateCode=ADMIRALTY&streetCode=ADMIRALTY&streetNumberCode=001 
```

---

## Response Wrapper

```json
{
  "status": "SUCCESS",
  "data": { ... }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `status` | `string` | `"SUCCESS"` or `"FAIL"` |
| `error` | `object?` | Error details (only present on failure) |
| `data` | `DeliveryTimeSlotsDto` | The delivery time slots payload |

## `DeliveryTimeSlotsDto` (data field)

```json
{
  "deliveryTimeSlot": {
    "timeSlotValue": "202607020900",
    "formattedValue": "2026年7月2日(四) 09:00 - 12:00",
    "isUnlimitedAddonTimeSlot": false,
    "isNotAvailable": false,
    "isExpressTimeslot": false
  },
  "chosenByUser": false,
  "deliveryTimeSlots": [
    {
      "timeSlotValue": "202607020900",
      "formattedValue": "2026年7月2日(四) 09:00 - 12:00",
      "isUnlimitedAddonTimeSlot": false,
      "isNotAvailable": false,
      "isExpressTimeslot": false
    },
    {
      "timeSlotValue": "202607021400",
      "formattedValue": "2026年7月2日(四) 14:00 - 18:00",
      "isUnlimitedAddonTimeSlot": false,
      "isNotAvailable": true,
      "isExpressTimeslot": false
    },
    {
      "timeSlotValue": "202607021800",
      "formattedValue": "2026年7月2日(四) 18:00 - 21:00",
      "isUnlimitedAddonTimeSlot": false,
      "isNotAvailable": false,
      "isExpressTimeslot": false
    }
  ],
  "deliveryFee": 30.0,
  "expressDeliveryFee": 60.0,
  "isExpress": false,
  "expressDeliveryTimeSlot": {
    "timeSlotValue": "202607020900",
    "formattedValue": "2026年7月2日(四) 09:00 - 12:00",
    "isUnlimitedAddonTimeSlot": false,
    "isNotAvailable": false,
    "isExpressTimeslot": true
  },
  "expressDeliveryTimeSlots": [
    {
      "timeSlotValue": "202607020900",
      "formattedValue": "2026年7月2日(四) 09:00 - 12:00",
      "isUnlimitedAddonTimeSlot": false,
      "isNotAvailable": false,
      "isExpressTimeslot": true
    },
    {
      "timeSlotValue": "202607021400",
      "formattedValue": "2026年7月2日(四) 14:00 - 18:00",
      "isUnlimitedAddonTimeSlot": false,
      "isNotAvailable": false,
      "isExpressTimeslot": true
    }
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `deliveryTimeSlot` | `DeliveryTimeSlotDto?` | The currently selected / default standard delivery slot for this cart. `null` if no standard slots available. |
| `expressDeliveryTimeSlot` | `DeliveryTimeSlotDto?` | The currently selected / default express delivery slot for this cart. `null` if no express slots available. Structure is the same as `deliveryTimeSlot`. |
| `chosenByUser` | `boolean` | `true` if the user explicitly selected this time slot; `false` if auto-assigned as default. |
| `deliveryTimeSlots` | `DeliveryTimeSlotDto[]` | List of all standard delivery time slots, including unavailable slots if applicable. |
| `expressDeliveryTimeSlots` | `DeliveryTimeSlotDto[]` | List of all express delivery time slots, including unavailable slots if applicable. Structure is the same as `deliveryTimeSlots`. |
| `deliveryFee` | `double` | Standard delivery fee. |
| `expressDeliveryFee` | `double` | Express delivery fee. |
| `isExpress` | `boolean` | `true` means express delivery timeslot is selected. |

## `DeliveryTimeSlotDto` (each slot)

| Field | Type | Description |
| --- | --- | --- |
| `timeSlotValue` | `string` | Numeric datetime identifier, format `yyyyMMddHHmm` (e.g. `"202607020900"`). Used when calling `update_delivery_time_slot`. |
| `formattedValue` | `string` | Human-readable display string, locale-aware (e.g. `"2026年7月2日(四) 09:00 - 12:00"` or `"2 Jul 2026 (Thu) 09:00 - 12:00"`). Appends localized "已滿" / "Full" suffix when `isNotAvailable = true`. |
| `isUnlimitedAddonTimeSlot` | `boolean` | `true` if this slot is provided by the Unlimited Addon promotion (free delivery addon). |
| `isNotAvailable` | `boolean` | `true` if the slot has no remaining delivery quota (displayed as "full"). |
| `isExpressTimeslot` | `boolean` | `true` if the slots is from express carline. |



# update delivery timeslot

## Request Stub (HTTP)

```http
GET /update_delivery_timeslot?dateTimeSlot=2026%E5%B9%B47%E6%9C%882%E6%97%A5(%E5%9B%9B)%2009:00%20-%2012:00&deliveryTimeByUser=true&timeSlotValue=202607020900
```

Param:

| Field | Type | Description |
| --- | --- | --- |
| `dateTimeSlot` | `string` |  |
| `deliveryTimeByUser` | `boolean` |  |
| `timeSlotValue` | `string` |  |
| `isExpress` | `boolean` | new |


---

## Response (No Change)
