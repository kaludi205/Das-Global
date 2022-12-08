using System.Data;
using System.Data.Entity;
using DasGlobal.Models;

namespace DasGlobal.Repositories
{
    public class UoWRepository
    {
        protected DbContextTransaction Transaction;

        private DasGlobalEntities _db;
        private RepoEmpresa       _repoEmpresa;
        private RepoPais          _repoPais;
        private RepoEmpleado      _repoEmpleado;
        private RepoSucursal      _repoSucursal;

        public RepoSucursal      RepoSucursal => _repoSucursal ??= new RepoSucursal(this);
        public RepoEmpleado      RepoEmpleado => _repoEmpleado ??= new RepoEmpleado(this);
        public RepoPais          RepoPais     => _repoPais ??= new RepoPais(this);
        public RepoEmpresa       RepoEmpresa  => _repoEmpresa ??= new RepoEmpresa(this);
        public DasGlobalEntities Db           => _db ??= new DasGlobalEntities(false);

        public DbContextTransaction GetTransaction()
        {
            return Transaction;
        }

        public void BeginTransaction()
        {
            Transaction = Db.Database.BeginTransaction();
        }

        public void Commit()
        {
            Transaction.Commit();
        }

        public void Rollback()
        {
            if (Transaction.UnderlyingTransaction.Connection != null)
            {
                Transaction.Rollback();
            }
        }

        public int SaveChanges()
        {
            return Db.SaveChanges();
        }
    }
}