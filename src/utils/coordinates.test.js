import test from 'ava';
import {
  parseDecimalDegrees,
  parseDegreesDecimalMinutes,
  parseDegreesMinutesSeconds,
  parseCoordinates,
  convertToDecimalDegrees,
  convertToDegreesDecimalMinutes,
  convertToDegreesMinutesSeconds,
  CoordinateFormat
} from './coordinates.js';

// Test Decimal Degrees parsing
test('parseDecimalDegrees - valid formats', t => {
  const result1 = parseDecimalDegrees('32.30642° N 122.61458° W');
  t.true(result1.isValid);
  t.is(Math.round(result1.latitude * 100000), 3230642);
  t.is(Math.round(result1.longitude * 100000), -12261458);

  const result2 = parseDecimalDegrees('+32.30642, -122.61458');
  t.true(result2.isValid);
  t.is(Math.round(result2.latitude * 100000), 3230642);
  t.is(Math.round(result2.longitude * 100000), -12261458);

  const result3 = parseDecimalDegrees('32.30642 -122.61458');
  t.true(result3.isValid);
  t.is(Math.round(result3.latitude * 100000), 3230642);
  t.is(Math.round(result3.longitude * 100000), -12261458);
});

test('parseDecimalDegrees - invalid formats', t => {
  const result1 = parseDecimalDegrees('invalid input');
  t.false(result1.isValid);
  t.truthy(result1.error);

  const result2 = parseDecimalDegrees('91.0 N 180.0 W'); // Invalid latitude
  t.false(result2.isValid);
  t.truthy(result2.error);
});

// Test Degrees Decimal Minutes parsing
test('parseDegreesDecimalMinutes - valid formats', t => {
  const result1 = parseDegreesDecimalMinutes('32° 18.385\' N 122° 36.875\' W');
  t.true(result1.isValid);
  t.is(Math.round(result1.latitude * 100000), 3230642);
  t.is(Math.round(result1.longitude * 100000), -12261458);

  const result2 = parseDegreesDecimalMinutes('32° 18.385\' 122° 36.875\'');
  t.true(result2.isValid);
  t.is(Math.round(result2.latitude * 100000), 3230642);
  t.is(Math.round(result2.longitude * 100000), 12261458); // Positive longitude without direction
});

test('parseDegreesDecimalMinutes - invalid formats', t => {
  const result = parseDegreesDecimalMinutes('invalid input');
  t.false(result.isValid);
  t.truthy(result.error);
});

// Test Degrees Minutes Seconds parsing
test('parseDegreesMinutesSeconds - valid formats', t => {
  const result1 = parseDegreesMinutesSeconds('32° 18\' 23.1" N 122° 36\' 52.5" W');
  t.true(result1.isValid);
  t.is(Math.round(result1.latitude * 100000), 3230642);
  t.is(Math.round(result1.longitude * 100000), -12261458);

  const result2 = parseDegreesMinutesSeconds('32° 18\' 23.1" 122° 36\' 52.5"');
  t.true(result2.isValid);
  t.is(Math.round(result2.latitude * 100000), 3230642);
  t.is(Math.round(result2.longitude * 100000), 12261458); // Positive longitude without direction
});

test('parseDegreesMinutesSeconds - invalid formats', t => {
  const result = parseDegreesMinutesSeconds('invalid input');
  t.false(result.isValid);
  t.truthy(result.error);
});

// Test auto-detection parsing
test('parseCoordinates - auto-detects formats', t => {
  // Should detect DMS
  const dmsResult = parseCoordinates('32° 18\' 23.1" N 122° 36\' 52.5" W');
  t.true(dmsResult.isValid);
  t.is(Math.round(dmsResult.latitude * 100000), 3230642);

  // Should detect DDM  
  const ddmResult = parseCoordinates('32° 18.385\' N 122° 36.875\' W');
  t.true(ddmResult.isValid);
  t.is(Math.round(ddmResult.latitude * 100000), 3230642);

  // Should detect DD
  const ddResult = parseCoordinates('32.30642° N 122.61458° W');
  t.true(ddResult.isValid);
  t.is(Math.round(ddResult.latitude * 100000), 3230642);
});

test('parseCoordinates - handles empty input', t => {
  const result1 = parseCoordinates('');
  t.false(result1.isValid);
  t.is(result1.error, 'Empty input');

  const result2 = parseCoordinates('   ');
  t.false(result2.isValid);
  t.is(result2.error, 'Empty input');
});

// Test coordinate conversions
test('convertToDecimalDegrees - formats correctly', t => {
  const result = convertToDecimalDegrees(32.30642, -122.61458);
  t.is(result, '32.30642° N 122.61458° W');

  const result2 = convertToDecimalDegrees(-32.30642, 122.61458);
  t.is(result2, '32.30642° S 122.61458° E');
});

test('convertToDegreesDecimalMinutes - formats correctly', t => {
  const result = convertToDegreesDecimalMinutes(32.30642, -122.61458);
  t.is(result, '32° 18.385\' N 122° 36.875\' W');

  const result2 = convertToDegreesDecimalMinutes(-32.30642, 122.61458);
  t.is(result2, '32° 18.385\' S 122° 36.875\' E');
});

test('convertToDegreesMinutesSeconds - formats correctly', t => {
  const result = convertToDegreesMinutesSeconds(32.30642, -122.61458);
  t.is(result, '32° 18\' 23.1" N 122° 36\' 52.5" W');

  const result2 = convertToDegreesMinutesSeconds(-32.30642, 122.61458);
  t.is(result2, '32° 18\' 23.1" S 122° 36\' 52.5" E');
});

// Test coordinate validation
test('coordinate validation - latitude bounds', t => {
  const validLat = parseDecimalDegrees('45.0, 0.0');
  t.true(validLat.isValid);

  const invalidLatHigh = parseDecimalDegrees('91.0, 0.0');
  t.false(invalidLatHigh.isValid);
  t.true(invalidLatHigh.error.includes('Latitude must be between'));

  const invalidLatLow = parseDecimalDegrees('-91.0, 0.0');
  t.false(invalidLatLow.isValid);
  t.true(invalidLatLow.error.includes('Latitude must be between'));
});

test('coordinate validation - longitude bounds', t => {
  const validLng = parseDecimalDegrees('0.0, 120.0');
  t.true(validLng.isValid);

  const invalidLngHigh = parseDecimalDegrees('0.0, 181.0');
  t.false(invalidLngHigh.isValid);
  t.true(invalidLngHigh.error.includes('Longitude must be between'));

  const invalidLngLow = parseDecimalDegrees('0.0, -181.0');
  t.false(invalidLngLow.isValid);
  t.true(invalidLngLow.error.includes('Longitude must be between'));
});

// Test real-world coordinate examples
test('real-world coordinates - San Francisco', t => {
  const sf = parseCoordinates('37.7749° N 122.4194° W');
  t.true(sf.isValid);
  t.is(Math.round(sf.latitude * 10000), 377749);
  t.is(Math.round(sf.longitude * 10000), -1224194);
});

test('real-world coordinates - New York City', t => {
  const nyc = parseCoordinates('40° 42\' 51" N 74° 0\' 23" W');
  t.true(nyc.isValid);
  t.is(Math.round(nyc.latitude * 100000), 4071417);
  t.is(Math.round(nyc.longitude * 100000), -7400639);
});

test('real-world coordinates - London', t => {
  const london = parseCoordinates('51° 30.5\' N 0° 7.6\' W');
  t.true(london.isValid);
  t.is(Math.round(london.latitude * 100000), 5150833);
  t.is(Math.round(london.longitude * 100000), -12667);
});

// Test edge cases
test('edge cases - equator and prime meridian', t => {
  const equator = parseCoordinates('0.0, 0.0');
  t.true(equator.isValid);
  t.is(equator.latitude, 0);
  t.is(equator.longitude, 0);
});

test('edge cases - poles', t => {
  const northPole = parseCoordinates('90.0, 0.0');
  t.true(northPole.isValid);
  t.is(northPole.latitude, 90);

  const southPole = parseCoordinates('-90.0, 0.0');
  t.true(southPole.isValid);
  t.is(southPole.latitude, -90);
});

test('edge cases - international date line', t => {
  const dateLine1 = parseCoordinates('0.0, 180.0');
  t.true(dateLine1.isValid);
  t.is(dateLine1.longitude, 180);

  const dateLine2 = parseCoordinates('0.0, -180.0');
  t.true(dateLine2.isValid);
  t.is(dateLine2.longitude, -180);
}); 