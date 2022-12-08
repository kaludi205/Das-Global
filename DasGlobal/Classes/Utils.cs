using System;
using System.Collections.Generic;
using System.Linq;

namespace DasGlobal.Classes
{
    public class Utils
    {
        private DateTime?    _Now;
        private List<string> CurrentGenerateKeys { get; set; } = new List<string>();
        private string       Chars        = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        public DateTime Now(bool renovar = false)
        {
            if (_Now != null && renovar == false) return _Now ?? new DateTime();

            _Now = DateTime.UtcNow.AddHours(-6);
            return _Now ?? new DateTime();
        }

        public string GetKey(int max = 20, string charsForKey = "")
        {
            var random = new Random();
            Chars += charsForKey;
            var key = "";
            while (key.Length < max)
                key += new string(Enumerable.Repeat(Chars, 64)
                                            .Select(s => s[random.Next(s.Length)]).ToArray());

            key = key.Substring(0, max);

            if (CurrentGenerateKeys.Contains(key))
            {
                key = GetKey(max, key);
            }

            CurrentGenerateKeys.Add(key);
            return key;
        }
    }
}