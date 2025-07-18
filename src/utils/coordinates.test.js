import test from 'ava';
import {
  parseDecimalDegrees,
  parseDegreesDecimalMinutes,
  parseDegreesMinutesSeconds,
  parseCoordinates,
  CoordinateFormat
} from '../simple-calc.js';

// Test Decimal Degrees parsing
test('parseDecimalDegrees - valid formats', t => {
  // Test coordinate with directions
  const result1 = parseDecimalDegrees('37.7749° N 122.4194° W');
  t.is(result1.latitude, 37.7749);
  t.is(result1.longitude, -122.4194);
  t.true(result1.isValid);

  // Test coordinate with comma separation
  const result2 = parseDecimalDegrees('+37.7749, -122.4194');
  t.is(result2.latitude, 37.7749);
  t.is(result2.longitude, -122.4194);
  t.true(result2.isValid);

  // Test coordinate without symbols
  const result3 = parseDecimalDegrees('37.7749 -122.4194');
  t.is(result3.latitude, 37.7749);
  t.is(result3.longitude, -122.4194);
  t.true(result3.isValid);
});

test('parseDecimalDegrees - invalid formats', t => {
  const result1 = parseDecimalDegrees('invalid input');
  t.false(result1.isValid);

  const result2 = parseDecimalDegrees('91.0 0.0'); // Invalid latitude
  t.false(result2.isValid);

  const result3 = parseDecimalDegrees('0.0 181.0'); // Invalid longitude
  t.false(result3.isValid);
});

// Test Degrees Decimal Minutes parsing
test('parseDegreesDecimalMinutes - valid formats', t => {
  const result = parseDegreesDecimalMinutes('37° 46.494\' N 122° 25.164\' W');
  t.is(Math.round(result.latitude * 10000) / 10000, 37.7749);
  t.is(Math.round(result.longitude * 10000) / 10000, -122.4194);
  t.true(result.isValid);
});

test('parseDegreesDecimalMinutes - invalid formats', t => {
  const result1 = parseDegreesDecimalMinutes('invalid input');
  t.false(result1.isValid);

  const result2 = parseDegreesDecimalMinutes('91° 0\' N 0° 0\' W'); // Invalid latitude
  t.false(result2.isValid);
});

// Test Degrees Minutes Seconds parsing
test('parseDegreesMinutesSeconds - valid formats', t => {
  const result = parseDegreesMinutesSeconds('37° 46\' 29.64" N 122° 25\' 9.84" W');
  t.is(Math.round(result.latitude * 10000) / 10000, 37.7749);
  t.is(Math.round(result.longitude * 10000) / 10000, -122.4194);
  t.true(result.isValid);
});

test('parseDegreesMinutesSeconds - invalid formats', t => {
  const result1 = parseDegreesMinutesSeconds('invalid input');
  t.false(result1.isValid);

  const result2 = parseDegreesMinutesSeconds('91° 0\' 0" N 0° 0\' 0" W'); // Invalid latitude
  t.false(result2.isValid);
});

// Test parseCoordinates auto-detection
test('parseCoordinates - auto-detects formats', t => {
  const ddResult = parseCoordinates('37.7749° N 122.4194° W');
  t.true(ddResult.isValid);
  t.is(ddResult.format, CoordinateFormat.DECIMAL_DEGREES);

  const ddmResult = parseCoordinates('37° 46.494\' N 122° 25.164\' W');
  t.true(ddmResult.isValid);
  t.is(ddmResult.format, CoordinateFormat.DEGREES_DECIMAL_MINUTES);

  const dmsResult = parseCoordinates('37° 46\' 29.64" N 122° 25\' 9.84" W');
  t.true(dmsResult.isValid);
  t.is(dmsResult.format, CoordinateFormat.DEGREES_MINUTES_SECONDS);
});

test('parseCoordinates - handles empty input', t => {
  const result = parseCoordinates('');
  t.false(result.isValid);
  t.is(result.error, 'Empty input');
});

// Coordinate validation tests
test('coordinate validation - latitude bounds', t => {
  const result1 = parseDecimalDegrees('90 0'); // Valid boundary
  t.true(result1.isValid);

  const result2 = parseDecimalDegrees('-90 0'); // Valid boundary
  t.true(result2.isValid);

  const result3 = parseDecimalDegrees('90.1 0'); // Invalid
  t.false(result3.isValid);
});

test('coordinate validation - longitude bounds', t => {
  const result1 = parseDecimalDegrees('0 180'); // Valid boundary
  t.true(result1.isValid);

  const result2 = parseDecimalDegrees('0 -180'); // Valid boundary
  t.true(result2.isValid);

  const result3 = parseDecimalDegrees('0 180.1'); // Invalid
  t.false(result3.isValid);
});

// Real-world coordinate tests
test('real-world coordinates - San Francisco', t => {
  const sf = parseCoordinates('37.7749° N 122.4194° W');
  t.true(sf.isValid);
  t.is(sf.latitude, 37.7749);
  t.is(sf.longitude, -122.4194);
});

test('real-world coordinates - New York City', t => {
  const nyc = parseCoordinates('40.7128° N 74.0060° W');
  t.true(nyc.isValid);
  t.is(nyc.latitude, 40.7128);
  t.is(nyc.longitude, -74.0060);
});

test('real-world coordinates - London', t => {
  const london = parseCoordinates('51.5074° N 0.1278° W');
  t.true(london.isValid);
  t.is(london.latitude, 51.5074);
  t.is(london.longitude, -0.1278);
});

// Edge case tests
test('edge cases - equator and prime meridian', t => {
  const equator = parseCoordinates('0° N 0° E');
  t.true(equator.isValid);
  t.is(equator.latitude, 0);
  t.is(equator.longitude, 0);
});

test('edge cases - poles', t => {
  const northPole = parseCoordinates('90° N 0° E');
  t.true(northPole.isValid);
  t.is(northPole.latitude, 90);

  const southPole = parseCoordinates('90° S 0° E');
  t.true(southPole.isValid);
  t.is(southPole.latitude, -90);
});

test('edge cases - international date line', t => {
  const dateLine = parseCoordinates('0° N 180° E');
  t.true(dateLine.isValid);
  t.is(dateLine.longitude, 180);
}); 