import importlib.util
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('rain',Path(__file__).parents[1]/'helpers/hue_falling_rain.py')
r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
class RainFrames(unittest.TestCase):
    def test_rainfall_speed_and_brightness(self):
        values=[r.weather_parameters(x) for x in [0.4,1,3,10,20]]
        self.assertEqual([x[0] for x in values],[15,30,55,80,100])
        self.assertEqual([x[1] for x in values],sorted([x[1] for x in values],reverse=True))
    def test_top_middle_bottom_sequence(self):
        period=r.weather_parameters(0.4)[1]
        peaks=[max(range(100),key=lambda n:r.frame(n*period/100,0.4)[section][2]) for section in [2,1,0]]
        self.assertEqual(peaks,sorted(peaks));self.assertEqual(len(set(peaks)),3)
    def test_continuity_and_blue_only(self):
        period=r.weather_parameters(0.4)[1]
        samples=[r.frame(i*period/1000,0.4) for i in range(1001)]
        self.assertTrue(all(red==0 and green==0 for f in samples for red,green,blue in f))
        self.assertTrue(all(abs(samples[i+1][j][2]-samples[i][j][2])<150 for i in range(1000) for j in range(3)))
        self.assertEqual(samples[0],samples[-1])

    def test_palette_fades_are_continuous(self):
        for source in r.PALETTE:
            for target in r.PALETTE:
                self.assertEqual(r.blend_color(source,target,0), source)
                for a,b in zip(r.blend_color(source,target,1),target):self.assertAlmostEqual(a,b)
                colors=[r.blend_color(source,target,n/1500) for n in range(1501)]
                self.assertLess(max(abs(a-b) for x,y in zip(colors,colors[1:]) for a,b in zip(x,y)),0.0011)
                for color in colors[::100]:
                    self.assertTrue(all(0<=v<=65535 for rgb in r.frame(1,20,color=color) for v in rgb))

    def test_reverse_and_bounds(self):
        for rate in [0.4,3,20]:
            for t in [0,0.2,0.5,1.2,3]:
                f=r.frame(t,rate)
                self.assertEqual(r.frame(t,rate,True),list(reversed(f)))
                self.assertTrue(all(0<=v<=65535 for rgb in f for v in rgb))
if __name__=='__main__':unittest.main()
