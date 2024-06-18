function getNumberSuffix(num: number): string {
  if (num >= 1000 && num < 1000000) {
    return 'K';
  } else if (num >= 1000000 && num < 1000000000) {
    return 'M';
  } else if (num >= 1000000000) {
    return 'B';
  }

  return '';
}

export function truncateNumber(num: number) {
  let result = num.toString();

  if (num >= 1000 && num < 1000000) {
    result = (num / 1000).toFixed(1);
  } else if (num >= 1000000 && num < 1000000000) {
    result = (num / 1000000).toFixed(1);
  } else if (num >= 1000000000) {
    result = (num / 1000000000).toFixed(1);
  }

  if (result.indexOf('.0') > -1) {
    return parseFloat(result).toString() + getNumberSuffix(num);
  }

  return result + getNumberSuffix(num);
}

export function getOrdinalDate(date: Date) {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'long' });

  const ordinal = (dayI: number) => {
    const j = dayI % 10,
      k = dayI % 100;
    if (j == 1 && k != 11) {
      return dayI + 'st';
    }
    if (j == 2 && k != 12) {
      return dayI + 'nd';
    }
    if (j == 3 && k != 13) {
      return dayI + 'rd';
    }
    return dayI + 'th';
  };

  return `${month} ${ordinal(day)}, ${year}`;
}

export function getInitials(firstName: string, lastName: string): string {
  return firstName.charAt(0) + lastName.charAt(0);
}

export function getFallbackAvatar(firstName: string, lastName: string): string {
  return (
    'https://ui-avatars.com/api/?size=512&format=png&name=' +
    encodeURIComponent(`${firstName} ${lastName}`) // UI Avatars
  );
}
