"""Generate a TinyDB-format import file from the AO training program data.

Maps the HTML training rows onto the task-tracker schema and writes
``tomer_training_import.json`` in the raw TinyDB layout that ``POST /import``
accepts ({"dashboard": {"1": {...}}, "tasks": {"1": {...}, ...}}).
"""

import json
import uuid

training_data = json.loads(r"""
[
  {"topic":"Forter","lesson":"Getting to know the new analysts","time":"00:30","tutor":"Or Woddis","type":"1 on 1","phase":"0","recording":"","completed":false,"comment":""},
  {"topic":"Forter","lesson":"Office intro","time":"00:30","tutor":"Or Woddis","type":"Frontal","phase":"0","recording":"","completed":false,"comment":""},
  {"topic":"Forter","lesson":"Training overview","time":"00:30","tutor":"Or Woddis","type":"Frontal","phase":"0","recording":"","completed":false,"comment":""},
  {"topic":"Forter","lesson":"IT intro and installations","time":"02:00","tutor":"Fadel Naser","type":"Frontal","phase":"0","recording":"","completed":false,"comment":""},
  {"topic":"Forter","lesson":"Intro to Forter","time":"00:45","tutor":"Oded Ungar","type":"Frontal","phase":"0","recording":"","completed":false,"comment":""},
  {"topic":"Forter","lesson":"M@S Group intro","time":"00:30","tutor":"Alon Rosenshtock","type":"Frontal","phase":"0","recording":"","completed":false,"comment":""},
  {"topic":"Forter","lesson":"HR & Payroll Onboarding","time":"01:15","tutor":"Noam Bar","type":"Frontal","phase":"0","recording":"","completed":false,"comment":""},
  {"topic":"Forter","lesson":"Business offering","time":"01:00","tutor":"Ran Rinker","type":"Frontal","phase":"1","recording":"https://drive.google.com/file/d/1tUWZTWnxvFKAV8bCmxJpb4V4xZNuvmBU/view","completed":false,"comment":""},
  {"topic":"Forter","lesson":"People and Roles","time":"01:00","tutor":"Dafna Barzilai","type":"Frontal","phase":"1","recording":"","completed":false,"comment":""},
  {"topic":"Forter","lesson":"AOP Deep Dive","time":"00:45","tutor":"Or Woddis","type":"Frontal","phase":"4","recording":"","completed":false,"comment":""},

  {"topic":"Tools","lesson":"Intro to Sigmund","time":"01:30","tutor":"Itay Gruber","type":"Frontal","phase":"1","recording":"https://drive.google.com/file/d/1KYxzS4cFWONffO54mH9Y4pwVxGpDDNTH/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Tools","lesson":"SQL basics and intro to Snowflake","time":"03:00","tutor":"Eyal Even-Tov","type":"Frontal+Self","phase":"1","recording":"","completed":false,"comment":""},
  {"topic":"Tools","lesson":"Intervention tools","time":"01:30","tutor":"Noa Ben Yair","type":"Frontal","phase":"2","recording":"https://drive.google.com/file/d/1_Rz-_DwF1QEQBdLugtDd40MiMccHwj6X/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Tools","lesson":"Performance and Data monitoring in ops","time":"01:00","tutor":"Tom Dangot","type":"Frontal","phase":"3","recording":"https://drive.google.com/file/d/1OiORBjIsl44_oeCQBUj0BoUqC9c3WFkr/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Tools","lesson":"Intro to Portal + HQ","time":"01:00","tutor":"Noga Silk","type":"Frontal","phase":"3","recording":"https://drive.google.com/file/d/1ey2nOkYKaniTvYTD5pdRvXK8pOMrmm2n/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Tools","lesson":"Work with Asana and Jira","time":"00:30","tutor":"Itay Gruber","type":"Frontal","phase":"4","recording":"https://drive.google.com/file/d/1Pb5s9M8hL5Y94ws3m0BaAZQRPL4fIJKq/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Tools","lesson":"Kibana Basics","time":"00:45","tutor":"Noa Ben Yair","type":"Frontal","phase":"4","recording":"https://drive.google.com/file/d/1njmaqy-PRDXkxuYR93iS_l7g2A3Bdk_f/view?usp=sharing","completed":false,"comment":""},

  {"topic":"Fraud and Solutions","lesson":"Fraud MOs 101","time":"01:30","tutor":"Allon Fayer","type":"Taped","phase":"1","recording":"https://drive.google.com/file/d/1KXOBIKxckHTWTo1i1QyxCdJK_21aT93y/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Elements","time":"01:30","tutor":"Tomer.M","type":"Taped","phase":"1","recording":"https://drive.google.com/file/d/1mWBj2get0wzAguN5ZGcO4E66UF_LTw_a/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Stolen CCs - How fraudsters work, monetisation, storytelling","time":"01:30","tutor":"Oded Ungar","type":"Taped","phase":"1","recording":"https://drive.google.com/file/d/1WRsdX04YetRH4DZmK_mNwKVwfnV3dHv7/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Intro to Detection","time":"01:00","tutor":"Alon Amir","type":"Frontal","phase":"2","recording":"https://drive.google.com/open?id=10yuAWtC7m094UVRZUUSlJb1bfMJ9ySZC","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Intro to Abuse Prevention","time":"01:00","tutor":"Eyal Even-Tov","type":"Frontal","phase":"2","recording":"https://drive.google.com/file/d/1N3L7K21vC_DG2vLvrkRuFee49VLtHlL0/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Risk Mitigation","time":"00:45","tutor":"Rony Lupatin","type":"Frontal","phase":"2","recording":"https://drive.google.com/file/d/1FV0EWWpx7_L1SXgsBWAe1ZE3l9dvyHdU/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Intro to Accounts Protection","time":"01:00","tutor":"Yuval Raz Bercovici","type":"Taped","phase":"2","recording":"https://drive.google.com/file/d/1GXzE4KWF356D4HDY4vGBhc8P53hWOTj-/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Chargebacks and Penalty Programs","time":"00:45","tutor":"Maria","type":"Taped","phase":"2","recording":"https://drive.google.com/file/d/1VWLGoNUFjdX1FFeEeHqSFXOgnmeEJ4cd/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"3DS / PSD2 deep dive","time":"01:00","tutor":"Mai Wiener","type":"Taped","phase":"4","recording":"https://drive.google.com/file/d/1t6pnxxeoHi8KMy2AIYMCiCGhZHMNOSGj/view","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Specific fraud MOs - 1. Physical","time":"01:00","tutor":"Dan Keni","type":"Frontal","phase":"5","recording":"https://drive.google.com/file/d/1lbHMOLcaEpHQB0Bff3jkULg_O_nEYVNr/view?ts=6211efa4","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Specific fraud MOs - 2. Travel","time":"01:00","tutor":"Hadas Ram","type":"Frontal","phase":"5","recording":"https://drive.google.com/file/d/1uogav-nEB0KRViRbZY4ZzU0syY84vymG/view?ts=6211ef92","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Specific fraud MOs - 3. Digital","time":"01:00","tutor":"Alon Rosenshtock","type":"Frontal","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Specific fraud MOs - 4. ATO","time":"01:00","tutor":"Noa Katabi","type":"Frontal","phase":"5","recording":"https://drive.google.com/file/d/1XIMdyLGiboyN0Y_9-GNll02-H8HEChuz/view?ts=6211ef88","completed":false,"comment":""},
  {"topic":"Fraud and Solutions","lesson":"Specific fraud MOs - 5. Food","time":"01:00","tutor":"Tal Weisman","type":"Frontal","phase":"5","recording":"https://drive.google.com/file/d/1u_6CP6DREoIKQz2CVVtLQbQAviLfeyFE/view","completed":false,"comment":""},

  {"topic":"System and Integration","lesson":"System medium level (journey of a transaction)","time":"01:00","tutor":"Chen Dolev","type":"Taped","phase":"1","recording":"https://drive.google.com/file/d/1yn5ra3s8w-Cr7dlC6ku2VsHQuuqbPADp/view?usp=sharing_eip&ts=60894e06","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"Transaction path","time":"00:45","tutor":"Taped","type":"Taped","phase":"1","recording":"https://drive.google.com/open?id=1fCDpzkpWd_2QRNXm2Xh08oYwIAn-uB04","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"Forter API's","time":"01:00","tutor":"Dor Ben Yehuda","type":"Taped","phase":"1","recording":"https://drive.google.com/file/d/1Z-bFt_HYvC2yZHWOloB9g6P0eBQNBqOo/view?usp=sharing","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"Intro to Payment Optimization","time":"01:00","tutor":"Sarah Shurin","type":"Taped","phase":"2","recording":"https://drive.google.com/file/d/1TZgX-P05UNUKszfWnbikPiY3620Nip4-/view?usp=sharing","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"Integration process","time":"01:00","tutor":"Or Barnatan","type":"Frontal","phase":"2","recording":"https://drive.google.com/file/d/1la7rUJPotXpp_BwAAxOwvZIhQG_l9w89/view?usp=sharing","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"Schema and base API","time":"00:45","tutor":"Dor Ben Yehuda","type":"Frontal","phase":"2","recording":"https://drive.google.com/file/d/1APsKDXJGcnXu6SzUxkyRjTOn0SgsYp_X/view?usp=sharing","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"Validation API + OrderStatus","time":"00:45","tutor":"Gabriel Elbaz","type":"Frontal","phase":"2","recording":"https://drive.google.com/file/d/1b9GE10E56l0H9gET6W1IaZEfbswTeKfe/view?usp=sharing","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"Claims processing","time":"01:00","tutor":"Raz Doitch","type":"Frontal","phase":"2","recording":"","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"Intro to Audrey","time":"00:45","tutor":"Elisha Diskind","type":"Frontal","phase":"3","recording":"","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"JS + SDK","time":"00:30","tutor":"Yuval Kupferschmied","type":"Taped","phase":"4","recording":"https://drive.google.com/file/d/1kGIv26Digw3jqbx72hVlVYhLEMGm-g7J/view?usp=sharing","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"Billing process","time":"01:00","tutor":"Amit Hananya","type":"Taped","phase":"3","recording":"https://drive.google.com/file/d/1uYjXXtac8c_v0nzeVJbmkT4U1741zKiC/view?usp=sharing","completed":false,"comment":""},
  {"topic":"System and Integration","lesson":"Tree Model intro and ML models in Forter","time":"01:00","tutor":"Tzlil Bejerano","type":"Taped","phase":"3","recording":"https://drive.google.com/file/d/1AH6QbLlsl_wj-fMxB5Gtt0ZPz-KuJMZg/view?usp=sharing","completed":false,"comment":""},

  {"topic":"Ops Basics","lesson":"CS/Implementation working methods","time":"00:30","tutor":"Dafna Barzilai","type":"Frontal","phase":"4","recording":"https://drive.google.com/file/d/1Nk3EotTKzamDo18alw48ghtgeU_NvG--/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Ops Basics","lesson":"Gap analysis methodology","time":"01:00","tutor":"Omer Ran","type":"Frontal","phase":"6","recording":"https://drive.google.com/file/d/1ZgxxFwD0pgGqx-eTOzOKOlO2KTQn71mh/view","completed":false,"comment":""},
  {"topic":"Ops Basics","lesson":"Understanding and calculating performance KPIs","time":"00:45","tutor":"Or Barnatan","type":"Frontal","phase":"5","recording":"https://drive.google.com/file/d/1GLPPjIdBEmPQVzqVh0e7zyvABvjQ421j/view?usp=sharing","completed":false,"comment":""},
  {"topic":"Ops Basics","lesson":"Debugging fundamentals (+ practice)","time":"01:00","tutor":"Alon Istacharov","type":"Frontal","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Ops Basics","lesson":"Velo policy","time":"00:45","tutor":"Noa Katabi","type":"Frontal","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Ops Basics","lesson":"Notebooks","time":"00:30","tutor":"Rony Lupatin","type":"Frontal","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Ops Basics","lesson":"Forter AI tools","time":"00:45","tutor":"Yuval Perlmuter","type":"Frontal","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Ops Basics","lesson":"Confetti","time":"00:15","tutor":"Dafna Barzilai","type":"Frontal","phase":"5","recording":"","completed":false,"comment":""},

  {"topic":"Practice","lesson":"TXs review (guided)","time":"06:00","tutor":"Dafna + Or + Dor + MA","type":"Frontal","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Practice","lesson":"TXs review (self)","time":"03:00","tutor":"-","type":"Self","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Practice","lesson":"Alerts review (guided)","time":"02:00","tutor":"Or + Dor","type":"Frontal","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Practice","lesson":"Alerts review (self)","time":"02:00","tutor":"-","type":"Self","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Practice","lesson":"Chbks anomaly (guided)","time":"01:00","tutor":"Dafna","type":"Frontal","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Practice","lesson":"Reports review","time":"02:00","tutor":"Or / Dafna","type":"Frontal","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Practice","lesson":"Kibana Exercise","time":"02:00","tutor":"Dor","type":"Self","phase":"5","recording":"","completed":false,"comment":""},
  {"topic":"Practice","lesson":"Tickets","time":"10:00","tutor":"Or / Dafna / Rony","type":"Frontal","phase":"6","recording":"","completed":false,"comment":""},
  {"topic":"Practice","lesson":"First PR","time":"1:00","tutor":"Or / Dafna","type":"Frontal","phase":"6","recording":"","completed":false,"comment":""},
  {"topic":"Practice","lesson":"Training Summary","time":"01:00","tutor":"Or Woddis","type":"Frontal","phase":"6","recording":"","completed":false,"comment":""}
]
""")


def hours(time_str):
    """Convert 'HH:MM' (or 'H:MM') to a float number of hours."""
    h, m = time_str.split(":")
    return round(int(h) + int(m) / 60, 2)


tasks = {}
for i, row in enumerate(training_data, start=1):
    tasks[str(i)] = {
        "id": str(uuid.uuid4()),
        "category": row["topic"],
        "name": row["lesson"],
        "tutor": row["tutor"],
        "type": row["type"],
        "phase": f"Phase {row['phase']}",
        "duration": hours(row["time"]),
        "recording": row["recording"],
        "comments": row["comment"],
        "status": "complete" if row["completed"] else "incomplete",
    }

db = {
    "dashboard": {
        "1": {
            "name": "AO Analyst Training Program",
            "member_name": "Tomer Alef",
            "team": "Analyst Operations (AO)",
            "created_at": "2026-06-01",
            "description": "Comprehensive analyst onboarding curriculum.",
            "comments": "",
        }
    },
    "tasks": tasks,
}

with open("tomer_training_import.json", "w") as f:
    json.dump(db, f, indent=2)

total_hours = sum(t["duration"] for t in tasks.values())
print(f"Wrote tomer_training_import.json with {len(tasks)} tasks, {total_hours:.2f} total hours.")
