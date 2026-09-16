import copy
import importlib.util
import unittest
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

spec = importlib.util.spec_from_file_location('quake', Path(__file__).parents[1] / 'helpers/shiratori_earthquakes.py')
q = importlib.util.module_from_spec(spec)
spec.loader.exec_module(q)

class EarthquakeTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 9, 16, 12, 0, tzinfo=timezone.utc)
        self.report = dict(eid='20260916205500', at=(self.now-timedelta(minutes=5)).isoformat(),
                           rdt=self.now.isoformat(), ctt='20260916210000', ift='発表', cod='+35.8+140.0-50000/',
                           json='20260916210000_test.json', mag='7.0',
                           int=[dict(code='13',city=[dict(code='1312200',maxi='6+')])])

    def events(self, scale, reports=None):
        detail = {'Body': {'Intensity': {'Observation': {'Pref': [{'Area': [{'City': [
            {'IntensityStation': [{'Code': q.STATION_CODE, 'Int': scale}, {'Code':'1312252','Int':'7'}]}
        ]}]}]}}}}
        return q.select_events(reports or [self.report], self.now, lambda _: detail)

    def test_local_scale_not_magnitude_or_other_station(self):
        self.assertEqual(self.events('2'), [])
        for scale, tier in [('3',1),('4',2),('5-',3),('5+',3),('6-',3),('6+',3),('7',3)]:
            self.assertEqual(self.events(scale)[0]['tier'], tier)
        self.assertEqual(self.events(None), [])

    def test_weak_local_event_kept_in_history_but_not_alerted(self):
        detail = {'Body': {'Intensity': {'Observation': {'Pref': [{'Area': [{'City': [
            {'IntensityStation': [{'Code': q.STATION_CODE, 'Int': '2'}]}
        ]}]}]}}}}
        rows = q.select_records([self.report], self.now, lambda _: detail)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['tier'], 0)
        self.assertEqual(q.select_events([self.report], self.now, lambda _: detail), [])

    def test_500km_radius(self):
        self.report['cod']='+38.0+141.0-50000/'
        self.assertEqual(len(self.events('3')), 1)
        self.report['cod']='+43.0+141.0-50000/'
        self.assertEqual(self.events('7'), [])

    def test_old_future_missing_and_withdrawn(self):
        for age in [1201,-1]:
            self.report['at']=(self.now-timedelta(seconds=age)).isoformat()
            self.assertEqual(self.events('7'), [])
        self.setUp();self.report['cod']='unknown'
        self.assertEqual(self.events('7'), [])
        self.setUp();withdrawn=copy.deepcopy(self.report)
        withdrawn.update(ift='取消',rdt=(self.now+timedelta(seconds=1)).isoformat())
        self.assertEqual(self.events('7',[self.report,withdrawn]), [])

    def test_deduplicate_reports(self):
        self.assertEqual(len(self.events('3',[self.report,self.report])),1)

class HistoryTests(unittest.TestCase):
    def test_history_survives_update_and_preserves_alert_audit(self):
        with tempfile.TemporaryDirectory() as folder:
            original = q.HISTORY
            q.HISTORY = Path(folder) / 'history.json'
            try:
                r = dict(id='20260917000748', occurred_at='2026-09-17T00:07:00+09:00', intensity='3', tier=1)
                q.save_history([r])
                q.save_history(alert=[r['id'], '3', 'started', 'quiet'])
                q.save_history(alert=[r['id'], '3', 'completed', 'quiet'])
                rows = q.save_history([dict(r, magnitude='4.8')])
                self.assertEqual(len(rows), 1)
                self.assertEqual(rows[0]['alert_status'], 'completed')
                self.assertEqual(rows[0]['speech_window'], 'quiet')
                self.assertEqual(q.save_history(), rows)
            finally:
                q.HISTORY = original

if __name__ == '__main__':
    unittest.main()
