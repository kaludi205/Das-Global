using System;

namespace DasGlobal.Classes
{
    public class Utils
    {
        private DateTime? _Now;

        public DateTime Now(bool renovar = false)
        {
            if (_Now != null && renovar == false) return _Now ?? new DateTime();

            _Now = DateTime.UtcNow.AddHours(-6);
            return _Now ?? new DateTime();
        }
    }
}