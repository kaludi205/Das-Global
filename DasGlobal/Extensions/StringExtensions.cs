namespace DasGlobal.Extensions
{
    public static class StringExtensions
    {
        public static string CleanString(this string value)
        {
            if (value == null) return null;

            value = value.Trim();
            while (value.Contains("  ")) value = value.Replace("  ", " ");

            value = value.ToUpper();

            return value;
        }
    }
}