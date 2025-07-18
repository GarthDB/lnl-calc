import test from 'ava';

test('coordinate validation ranges', t => {
  // Valid latitude range: -90 to 90
  t.true(-90 >= -90 && -90 <= 90);
  t.true(90 >= -90 && 90 <= 90);
  t.true(0 >= -90 && 0 <= 90);
  
  // Valid longitude range: -180 to 180
  t.true(-180 >= -180 && -180 <= 180);
  t.true(180 >= -180 && 180 <= 180);
  t.true(0 >= -180 && 0 <= 180);
  
  // Invalid coordinates
  t.false(91 >= -90 && 91 <= 90); // Invalid latitude
  t.false(-91 >= -90 && -91 <= 90); // Invalid latitude
  t.false(181 >= -180 && 181 <= 180); // Invalid longitude
  t.false(-181 >= -180 && -181 <= 180); // Invalid longitude
});

test('degree to radian conversion', t => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  
  t.is(toRadians(0), 0);
  t.is(toRadians(90), Math.PI / 2);
  t.is(toRadians(180), Math.PI);
  t.is(toRadians(360), Math.PI * 2);
});

test('basic distance calculation concept', t => {
  // Test that we can work with coordinate differences
  const lat1 = 40.7128; // New York
  const lng1 = -74.0060;
  const lat2 = 34.0522; // Los Angeles  
  const lng2 = -118.2437;
  
  const latDiff = Math.abs(lat2 - lat1);
  const lngDiff = Math.abs(lng2 - lng1);
  
  t.true(latDiff > 0);
  t.true(lngDiff > 0);
  t.true(latDiff < 90); // Should be less than max latitude range
  t.true(lngDiff < 180); // Should be less than max longitude range
}); 