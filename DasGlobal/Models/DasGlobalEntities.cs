namespace DasGlobal.Models
{
    public partial class DasGlobalEntities
    {
        public DasGlobalEntities(bool lazyloading) : base("name=DasGlobalEntities")
        {
            Configuration.LazyLoadingEnabled    = lazyloading;
            Configuration.ValidateOnSaveEnabled = false;
            Database.CommandTimeout             = 500;
        }
    }
}