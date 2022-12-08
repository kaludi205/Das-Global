using System.Collections.Generic;

namespace DasGlobal.Extensions
{
    public static class IEnumerableExtensions
    {
        public static List<TSource> ConcatArray<TSource>(this IEnumerable<IEnumerable<TSource>> source)
        {
            var list = new List<TSource>();
            foreach (var item in source)
            {
                list.AddRange(item);
            }

            return list;
        }
    }
}